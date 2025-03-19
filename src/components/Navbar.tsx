
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Subjects', path: '/subjects' },
    { name: 'Reports', path: '/reports' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 px-6',
      isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-app-blue to-app-blue-dark">
            MyAttendance
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors py-1 relative',
                location.pathname === link.path 
                  ? 'text-app-blue' 
                  : 'text-foreground/70 hover:text-foreground'
              )}
            >
              {link.name}
              {location.pathname === link.path && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-app-blue rounded-full animate-fade-in" />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden rounded-md p-2 text-foreground/70 hover:text-foreground focus:outline-none"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={cn(
        'fixed inset-0 bg-white z-40 pt-20 px-4 transition-transform duration-300 ease-in-out md:hidden',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="flex flex-col space-y-6">
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={cn(
                'text-lg font-medium transition-colors duration-200 ease-in-out py-2',
                location.pathname === link.path 
                  ? 'text-app-blue' 
                  : 'text-foreground/70 hover:text-foreground'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
