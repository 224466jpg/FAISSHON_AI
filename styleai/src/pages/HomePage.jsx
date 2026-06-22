import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { features } from '../data/styleData';

function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">STYLEAI fit check lab</p>
          <h1>Your Personal AI Fashion Stylist</h1>
          <p>
            Upload your outfit photo and get instant AI-powered style analysis, color matching,
            and outfit recommendations.
          </p>
          <div className="button-row">
            <Link className="primary-button" to="/upload">Analyze My Outfit</Link>
            <Link className="secondary-button" to="/recommendations">Explore Styles</Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="Fashion model editorial image">
          <div className="hero-score glass-card">
            <span>Style score</span>
            <strong>92</strong>
            <small>Elegant color balance</small>
          </div>
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          eyebrow="Core features"
          title="Premium styling help in minutes"
          text="Designed for students, creators, and anyone who wants sharper outfits without a personal stylist."
        />
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card glass-card" key={feature.title}>
              <span>{feature.title.slice(0, 2)}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section split-section">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>Upload Photo → AI Analysis → Get Styling Tips</h2>
          <p>
            Start with one outfit image. The app creates a readable analysis with a score,
            occasion suitability, improvement tips, and ready-to-copy outfit ideas.
          </p>
          <Link className="text-link" to="/analysis">View sample analysis</Link>
        </div>
        <div className="steps-panel">
          {['Upload Photo', 'AI Analysis', 'Get Styling Tips'].map((step, index) => (
            <div className="step-card" key={step}>
              <strong>0{index + 1}</strong>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section testimonial-band">
        <SectionHeader
          eyebrow="Testimonials"
          title="Built to impress in demos and portfolios"
          text="Clean enough for a startup pitch, practical enough for real outfit planning."
        />
        <div className="testimonial-grid">
          <blockquote>“The analysis page made my project feel like a real product.”</blockquote>
          <blockquote>“I used the recommendations before a college presentation.”</blockquote>
          <blockquote>“The wardrobe gallery is simple, pretty, and easy to explain.”</blockquote>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
