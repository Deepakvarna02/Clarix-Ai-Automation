import React, { createContext, useEffect } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  useEffect(() => {
    localStorage.setItem('darkMode', 'true');
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDarkMode: true, toggleDarkMode: () => {} }}>
      {children}
      <style>{`
        [data-theme="dark"] {
          --bg: #0a0a0a;
          --bg-card: #141414;
          --bg-card2: #1a1a1a;
          --cyan: #00c8ff;
          --white: #ffffff;
          --muted: #666680;
          --muted2: #444455;
          --border: rgba(255, 255, 255, 0.07);
          --border-cyan: rgba(0, 200, 255, 0.25);
        }
      `}</style>
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = React.useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};

export default DarkModeContext;
