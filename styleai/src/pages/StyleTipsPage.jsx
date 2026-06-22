import SectionHeader from '../components/SectionHeader';
import { styleTips } from '../data/styleData';

function StyleTipsPage() {
  return (
    <main className="page">
      <SectionHeader
        eyebrow="Style tips"
        title="Small changes that make outfits look expensive"
        text="Beginner-friendly advice that pairs nicely with the AI analysis response."
      />

      <section className="tips-grid">
        {styleTips.map((tip, index) => (
          <article className="tip-card glass-card" key={tip}>
            <strong>Tip {index + 1}</strong>
            <p>{tip}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default StyleTipsPage;
