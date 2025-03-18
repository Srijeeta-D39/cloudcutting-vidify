
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MenuIcon, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? 'glass py-2 shadow-sm' : 'bg-transparent py-4'
  }`;

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Dashboard', path: '/dashboard' },
    { title: 'Editor', path: '/editor' },
  ];

  return (
    <header className={navClasses}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              CloudCut
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-foreground/80'
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="h-9 px-4">
                Sign In
              </Button>
              <Button size="sm" className="h-9 px-4">
                Get Started
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden flex items-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-x-0 top-[57px] bg-background/95 backdrop-blur-lg transition-all duration-300 transform ${
          mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
        } border-b`}
      >
        <div className="container flex flex-col space-y-4 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`py-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path
                  ? 'text-primary'
                  : 'text-foreground/80'
              }`}
            >
              {link.title}
            </Link>
          ))}
          <div className="flex flex-col space-y-3 pt-2">
            <Button variant="outline" size="sm" className="w-full justify-center">
              Sign In
            </Button>
            <Button size="sm" className="w-full justify-center">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
