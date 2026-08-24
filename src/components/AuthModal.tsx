import React, { useState } from 'react';
import { X, User, Lock, Mail, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

const ADMIN_EMAILS = ['ibrahimfaruqolamilekan4@gmail.com', 'roheemoh2020@gmail.com'];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const checkIsAdmin = (userEmail: string | null) => {
    if (!userEmail) return false;
    return ADMIN_EMAILS.includes(userEmail.trim().toLowerCase()) || userEmail.toLowerCase().includes('admin');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const isAdmin = checkIsAdmin(email);
      const uid = 'user_' + Date.now();
      const name = displayName || (isAdmin ? 'Reemah Admin' : email.split('@')[0]);

      const newUser: UserProfile = {
        uid,
        email,
        displayName: name,
        isAdmin,
        wishlist: [],
      };

      // Save user to Neon DB via API
      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });
      } catch (err) {
        console.log("Neon user sync error:", err);
      }

      onLoginSuccess(newUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const demoEmail = 'google_user@gmail.com';
      const isAdmin = checkIsAdmin(demoEmail);
      const loggedUser: UserProfile = {
        uid: 'google_' + Date.now(),
        email: demoEmail,
        displayName: 'Google Authenticated User',
        isAdmin,
        wishlist: [],
      };
      onLoginSuccess(loggedUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (isAdminRole: boolean) => {
    const demoEmail = isAdminRole ? 'ibrahimfaruqolamilekan4@gmail.com' : 'buyer@gmail.com';
    const demoUser: UserProfile = {
      uid: isAdminRole ? 'admin-user-id' : 'buyer-user-id-' + Date.now(),
      email: demoEmail,
      displayName: isAdminRole ? 'Reemah Admin' : 'Amina Bello (Buyer)',
      isAdmin: isAdminRole,
      wishlist: [],
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Reemah World Import</span>
          </div>
          <h3 className="text-2xl font-serif font-bold">
            {isSignUp ? 'Create Buyer Account' : 'Sign In to Your Account'}
          </h3>
          <p className="text-xs text-stone-300 mt-1">Access community feed, wishlist, and track orders securely.</p>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Quick Demo Logins for Testing */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">⚡ Quick Demo Access</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Login as Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin(false)}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login as Buyer</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-4 text-xs text-stone-400 uppercase tracking-wider">or use email</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Zainab Ahmed"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. buyer@gmail.com or admin@reemahworld.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-stone-600 hover:text-stone-900 font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
