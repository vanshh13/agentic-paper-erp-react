import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.innerWidth >= 768; // Default based on screen size
  });

  useEffect(() => {
    const handleResize = () => {
      // Only auto-close on mobile, don't force open on desktop
      if (window.innerWidth < 768 && isOpen) {
        setIsOpen(false);
        localStorage.setItem('sidebarOpen', JSON.stringify(false));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleSetIsOpen = (value) => {
    setIsOpen(value);
    localStorage.setItem('sidebarOpen', JSON.stringify(value));
  };

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen: handleSetIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};