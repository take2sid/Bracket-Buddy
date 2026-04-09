import { useState } from 'react';
import { BookmarkCheck, GitCompare, Search, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import TeamCard from '../components/dashboard/TeamCard';
import MatchupCard from '../components/dashboard/MatchupCard';
import { TeamCardSkeleton, MatchupCardSkeleton } from '../components/ui/SkeletonLoader';
import { MatchupInsight, User } from '../types';
import { findTeam, generateMatchupInsight, SEARCH_SUGGESTIONS } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  user: User;
}

type AnalysisState = 'idle' | 'loading' | 'results' | 'error';

export default function Dashboard({ user }: DashboardProps) {
  const [queryA, setQueryA] = useState('');
  const [queryB, setQueryB] = useState('');
  const [state, setState] = useState<AnalysisState>('idle');
  const [matchup, setMatchup] = useState<MatchupInsight | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [pinned, setPinned] = useState(false);

  const handleRunComparison = async () => {
    if (!queryA.trim()) return;
    setState('loading');
    setMatchup(null);
    setPinned(false);
    setErrorMsg('');

    await new Promise((r) => setTimeout(r, 1200));

    if (queryB.trim()) {
      const result = generateMatchupInsight(queryA, queryB);
      if (!result) {
        const teamA = findTeam(queryA);
        const teamB = findTeam(queryB);
        if (!teamA && !teamB) {
          setState('error');
          setErrorMsg(`No data found for "${queryA}" or "${queryB}". Try: LSU, Vanderbilt, Tennessee, Texas A&M, Florida, or Wake Forest.`);
          return;
        }
      }
      if (result) {
        setMatchup(result);
        setState('results');
        return;
      }
    }

    const teamA = findTeam(queryA);
    if (!teamA) {
      setState('error');
      setErrorMsg(`No data found for "${queryA}". Try: LSU, Vanderbilt, Tennessee, Texas A&M, Florida, or Wake Forest.`);
      return;
    }

    const fallback: MatchupInsight = {
      teamA,
      teamB: teamA,
      summary: `Single-team analysis for ${teamA.teamName}. Add a second team to run a full head-to-head comparison.`,
      marketOdds: `${teamA.teamName} generating consistent draft market activity this week. Current prospects tracking above expected value.`,
      winProbabilityA: 65,
      winProbabilityB: 35,
      draftValueEdge: `${teamA.teamName} prospects trending +12% above market baseline`,
    };
    setMatchup(fallback);
    setState('results');
  };

  const handlePinInsight = async () => {
    if (!matchup || pinned) return;
    setPinLoading(true);
    try {
      const { error } = await supabase.from('saved_insights').insert({
        user_email: user.email,
        user_name: user.name,
        team_a_name: matchup.teamA.teamName,
        team_b_name: matchup.teamB.teamName !== matchup.teamA.teamName ? matchup.teamB.teamName : '',
        insight_summary: matchup.summary,
        market_odds: matchup.marketOdds,
        team_a_insight: matchup.teamA.insight,
        team_b_insight: matchup.teamB.teamName !== matchup.teamA.teamName ? matchup.teamB.insight : '',
        is_pinned: true,
      });
      if (!error) setPinned(true);
    } finally {
      setPinLoading(false);
    }
  };

  const isLoading = state === 'loading';
  const hasResults = state === 'results' && matchup;
  const showTwoTeams = hasResults && matchup!.teamB.teamName !== matchup!.teamA.teamName;

  return (
    <div className="min-h-screen bg-navy-950 pb-16">
      <div className="bg-navy-900/80 border-b border-white/8 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-accent-orange" />
              <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">
                Welcome back, {user.name.split(' ')[0]}
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Analysis Dashboard
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <InputField
                label="Analyze First Team"
                value={queryA}
                onChange={(e) => setQueryA(e.target.value)}
                placeholder="e.g. LSU, Tennessee, Wake Forest..."
                suggestions={SEARCH_SUGGESTIONS}
                onSuggestionClick={(v) => setQueryA(v)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunComparison()}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Add Comparison Team"
                value={queryB}
                onChange={(e) => setQueryB(e.target.value)}
                placeholder="e.g. Vanderbilt, Florida... (optional)"
                suggestions={SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase() !== queryA.toLowerCase())}
                onSuggestionClick={(v) => setQueryB(v)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunComparison()}
              />
            </div>
            <Button
              onClick={handleRunComparison}
              loading={isLoading}
              disabled={!queryA.trim() || isLoading}
              size="md"
              icon={isLoading ? undefined : <GitCompare size={16} />}
              className="shrink-0 h-[50px]"
            >
              Make Prediction
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {state === 'idle' && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mb-5 border border-white/10">
              <Search size={28} className="text-white/30" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Search for a team to begin</h3>
            <p className="text-white/40 text-sm text-center max-w-sm">
              Enter a college baseball program above to generate AI-powered insights and draft market analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {SEARCH_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQueryA(s); }}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-navy-800 border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-16 h-16 bg-accent-red/15 border border-accent-red/30 rounded-full flex items-center justify-center mb-5">
              <Search size={28} className="text-accent-red/70" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-white/50 text-sm text-center max-w-sm">{errorMsg}</p>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TeamCardSkeleton />
            <MatchupCardSkeleton />
            <TeamCardSkeleton />
          </div>
        )}

        {hasResults && (
          <div className="animate-fade-in space-y-6">
            <div className={`grid gap-6 ${showTwoTeams ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto'}`}>
              <TeamCard team={matchup!.teamA} side="A" />
              <MatchupCard matchup={matchup!} />
              {showTwoTeams && <TeamCard team={matchup!.teamB} side="B" />}
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                variant={pinned ? 'secondary' : 'primary'}
                onClick={handlePinInsight}
                loading={pinLoading}
                disabled={pinned}
                icon={<BookmarkCheck size={16} />}
                iconPosition="left"
              >
                {pinned ? 'Insight Pinned!' : 'Pin Insight'}
              </Button>
              {pinned && (
                <span className="text-xs text-white/40 animate-fade-in">
                  Saved to your insights
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-16 border-t border-white/8 bg-navy-900/40 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center flex-wrap gap-8 sm:gap-14">
            {[
              { src: '/a_and_m_logo.jpg', alt: 'Texas A&M' },
              { src: '/florida_logo.jpg', alt: 'Florida' },
              { src: '/LSU_logo_1.jpg', alt: 'LSU' },
              { src: '/tennessee_logo.jpg', alt: 'Tennessee' },
              { src: '/vanderbilt_logo.jpg', alt: 'Vanderbilt' },
              { src: '/wake_forest_logo.jpg', alt: 'Wake Forest' },
            ].map(({ src, alt }) => (
              <div
                key={alt}
                className="group flex flex-col items-center gap-3 cursor-pointer"
                onClick={() => { setQueryA(alt); }}
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/30 group-hover:scale-110 transition-all duration-300 shadow-card">
                  <img src={src} alt={alt} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors duration-200 font-medium">
                  {alt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
