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
    return window.innerWidth >= 1024; // Default based on screen size
  });

  useEffect(() => {
    const handleResize = () => {
      const shouldBeOpen = window.innerWidth >= 1024;
      setIsOpen(prev => {
        if (prev !== shouldBeOpen) {
          localStorage.setItem('sidebarOpen', JSON.stringify(shouldBeOpen));
        }
        return shouldBeOpen;
      });
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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