import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div>
        <p className="eyebrow">STYLEAI</p>
        <h2>AI style intelligence for every closet.</h2>
        <p>
          Upload a look, understand what works, and build outfits that feel intentional for class,
          interviews, parties, and everyday plans.
        </p>
      </div>
      <div className="footer-grid">
        <Link to="/upload">Analyze outfit</Link>
        <Link to="/recommendations">Explore styles</Link>
        <Link to="/shopping">Shopping</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/style-tips">Style tips</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </footer>
  );
}

export default Footer;
