
import React, { useState } from 'react';
import { ViewState } from './types';
import { Veranda } from './components/Veranda';
import { Vault } from './components/Vault';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.VERANDA_HOME);
  const [isNewUser, setIsNewUser] = useState(false);

  // Simple state machine for navigation
  const handleNavigate = (view: ViewState) => {
    // Prevent accessing Vault views if not logged in
    if (!isLoggedIn && view.startsWith('VAULT')) {
      return;
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleLogin = (isNewRegistration: boolean = false) => {
    // In a real app, this would be an OAuth flow
    setIsLoggedIn(true);
    setIsNewUser(isNewRegistration);
    
    if (isNewRegistration) {
      setCurrentView(ViewState.VAULT_VERIFICATION);
    } else {
      setCurrentView(ViewState.VAULT_DASHBOARD);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsNewUser(false);
    setCurrentView(ViewState.VERANDA_HOME);
  };

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
