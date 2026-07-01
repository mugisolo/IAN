import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { ViewState } from './types';
import { Veranda } from './components/Veranda';
import { Vault } from './components/Vault';
import { LanguageProvider } from './contexts/LanguageContext';
import { initAuth, googleSignIn, logout } from './services/firebase.ts';

const AppContent: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.VERANDA_HOME);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth state listener to restore existing sessions
  useEffect(() => {
    const unsubscribe = initAuth(
      async (user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
        setIsLoading(false);
        // Synchronize with the Express + PostgreSQL backend
        try {
          const idToken = await user.getIdToken();
          await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
          });
        } catch (err) {
          console.error('Failed to sync user with database on session load:', err);
        }
      },
      () => {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Simple state machine for navigation
  const handleNavigate = (view: ViewState) => {
    // Prevent accessing Vault views if not logged in
    if (!isLoggedIn && view.startsWith('VAULT')) {
      return;
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleLogin = async (isNewRegistration: boolean = false) => {
    setIsLoading(true);
    try {
      const authResult = await googleSignIn();
      if (authResult) {
        const { user } = authResult;
        setCurrentUser(user);
        setIsLoggedIn(true);
        setIsNewUser(isNewRegistration);

        // Synchronize authenticated user details with our Cloud SQL PostgreSQL database
        const idToken = await user.getIdToken();
        const syncResponse = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (!syncResponse.ok) {
          console.error('Relational DB sync failed:', await syncResponse.text());
        }

        if (isNewRegistration) {
          setCurrentView(ViewState.VAULT_VERIFICATION);
        } else {
          setCurrentView(ViewState.VAULT_DASHBOARD);
        }
      }
    } catch (err) {
      console.error('Login flow failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setIsLoggedIn(false);
      setIsNewUser(false);
      setCurrentUser(null);
      setCurrentView(ViewState.VERANDA_HOME);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center font-serif text-vault-amber">
        <div className="w-12 h-12 border-4 border-vault-amber border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm uppercase tracking-widest font-bold">Verifying Fellowship Seal...</p>
      </div>
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <Vault 
          currentView={currentView}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          isNewUser={isNewUser}
        />
      ) : (
        <Veranda 
          currentView={currentView}
          onNavigate={handleNavigate}
          onLogin={handleLogin}
        />
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
