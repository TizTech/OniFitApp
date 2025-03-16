import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase, signOut } from '../lib/supabase';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsLoggedIn(!!data.session);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-secondary shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary font-bold text-2xl"
          >
            OniFit
          </motion.span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {!loading && (
            isLoggedIn ? (
              <>
                <Link to="/dashboard" className={`text-white hover:text-primary transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : ''}`}>
                  Dashboard
                </Link>
                <Link to="/subscription" className={`text-white hover:text-primary transition-colors ${location.pathname.includes('/subscription') ? 'text-primary' : ''}`}>
                  Subscription
                </Link>
                <Link to="/account" className={`text-white hover:text-primary transition-colors ${location.pathname === '/account' ? 'text-primary' : ''}`}>
                  Account
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-white hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className={`text-white hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary' : ''}`}>
                  Home
                </Link>
                <Link to="/login" className={`text-white hover:text-primary transition-colors ${location.pathname === '/login' ? 'text-primary' : ''}`}>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Start Free Trial
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-secondary-light py-4"
        >
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {!loading && (
              isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/subscription"
                    className="text-white hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Subscription
                  </Link>
                  <Link
                    to="/account"
                    className="text-white hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-white hover:text-primary transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="text-white hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/login"
                    className="text-white hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-primary inline-block text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Start Free Trial
                  </Link>
                </>
              )
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar; 