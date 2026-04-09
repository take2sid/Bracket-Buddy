import { useState } from 'react';
import { BarChart2, ArrowRight, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';
import { Page, User } from '../types';

interface AuthPageProps {
  onSignIn: (user: User) => void;
  onNavigate: (page: Page) => void;
}

export default function AuthPage({ onSignIn, onNavigate }: AuthPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '' });

  const validate = () => {
    const next = { name: '', email: '' };
    if (!name.trim()) next.name = 'Name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = 'Enter a valid email';
    setErrors(next);
    return !next.name && !next.email;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      onSignIn({ name: name.trim(), email: email.trim().toLowerCase() });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-red/10 rounded-full blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2.5 w-fit">
            <div className="w-9 h-9 bg-gradient-to-br from-accent-red to-accent-orange rounded-lg flex items-center justify-center shadow-glow">
              <BarChart2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">
              Bracket<span className="text-accent-red">Buddy</span>
            </span>
          </button>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
                Surface the signal.<br />
                <span className="bg-gradient-to-r from-accent-red to-accent-orange bg-clip-text text-transparent">
                  Beat the market.
                </span>
              </h2>
              <p className="text-white/55 leading-relaxed">
                Real-time college baseball analytics connected to MLB Draft prediction markets. The edge serious analysts need.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'AI-generated matchup breakdowns',
                'Live draft market intelligence',
                'Save & pin your best insights',
                'Head-to-head prospect comparisons',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-red to-accent-orange flex items-center justify-center shrink-0">
                    <ArrowRight size={10} className="text-white" />
                  </div>
                  <span className="text-white/70 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-navy-800/60 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <TrendingUp size={18} className="text-accent-orange mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Today's Top Signal</p>
                  <p className="text-white/55 text-xs leading-relaxed">
                    Wake Forest's Nick Kurtz is the most undervalued prospect in this year's draft class. Market underweighting by an estimated 18%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-white/25 text-xs">For informational purposes only. Not financial advice.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-red to-accent-orange rounded-lg flex items-center justify-center shadow-glow">
              <BarChart2 size={15} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">
              Bracket<span className="text-accent-red">Buddy</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">Get started</h1>
            <p className="text-white/50 text-sm">
              Enter your details to access your analytics dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                placeholder="e.g. Alex Rivera"
                className={[
                  'w-full bg-navy-900 border rounded-xl px-4 py-3.5 text-white placeholder-white/30',
                  'focus:outline-none focus:bg-navy-800 transition-all duration-200 text-sm',
                  errors.name ? 'border-accent-red/60' : 'border-white/15 focus:border-accent-red/50',
                ].join(' ')}
              />
              {errors.name && <p className="mt-1.5 text-xs text-accent-red">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                placeholder="you@example.com"
                className={[
                  'w-full bg-navy-900 border rounded-xl px-4 py-3.5 text-white placeholder-white/30',
                  'focus:outline-none focus:bg-navy-800 transition-all duration-200 text-sm',
                  errors.email ? 'border-accent-red/60' : 'border-white/15 focus:border-accent-red/50',
                ].join(' ')}
              />
              {errors.email && <p className="mt-1.5 text-xs text-accent-red">{errors.email}</p>}
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
              Continue to Dashboard
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-white/30">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
