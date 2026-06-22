import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Upload', path: '/upload' },
  { label: 'Analysis', path: '/analysis' },
  { label: 'Looks', path: '/recommendations' },
  { label: 'Shopping', path: '/shopping' },
  { label: 'Wardrobe', path: '/wardrobe' },
  { label: 'Tips', path: '/style-tips' },
];

function Navbar({ cartCount = 0 }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-drawer-open', open);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('nav-drawer-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="STYLEAI home">
          <span className="brand-mark">AI</span>
          <span>STYLEAI</span>
        </Link>

        <button
          className={`icon-button menu-button ${open ? 'is-open' : ''}`}
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-controls="primary-navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="primary-navigation"
          className={`nav-links ${open ? 'is-open' : ''}`}
          aria-label="Primary navigation"
        >
          <div className="nav-link-group">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </NavLink>
          </div>
          <div className="nav-actions">
            <NavLink className="cart-link" to="/cart" onClick={() => setOpen(false)}>
              Cart
              <span>{cartCount}</span>
            </NavLink>
            <Link className="nav-cta" to="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          </div>
        </nav>
      </div>
      {open && (
        <motion.button
          className="nav-scrim"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </header>
  );
}

export default Navbar;
