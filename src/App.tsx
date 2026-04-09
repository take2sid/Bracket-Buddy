import { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import SavedInsights from './pages/SavedInsights';
import { Page, User } from './types';

const USER_KEY = 'bb_user';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
        setPage('dashboard');
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const handleSignIn = (u: User) => {
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setPage('dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    setPage('landing');
  };

  const handleNavigate = (p: Page) => {
    if ((p === 'dashboard' || p === 'saved') && !user) {
      setPage('auth');
      return;
    }
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (page === 'landing') return <LandingPage onNavigate={handleNavigate} />;
  if (page === 'auth') return <AuthPage onSignIn={handleSignIn} onNavigate={handleNavigate} />;

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar
        currentPage={page}
        user={user}
        onNavigate={handleNavigate}
        onSignOut={handleSignOut}
      />
      {page === 'dashboard' && user && <Dashboard user={user} />}
      {page === 'saved' && user && <SavedInsights user={user} />}
    </div>
  );
}
