import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { sampleAnalysis } from '../data/styleData';

function getLatestAnalysis() {
  try {
    const saved = localStorage.getItem('fashion-ai-last-analysis');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function AnalysisPage() {
  const [analysis, setAnalysis] = useState(sampleAnalysis);

  useEffect(() => {
    setAnalysis(getLatestAnalysis() || sampleAnalysis);
  }, []);

  return (
    <main className="page">
      <SectionHeader
        eyebrow="AI outfit analysis"
        title="Instant feedback that feels personal"
        text="After uploading a photo, this page shows your latest AI outfit score and improvement plan."
      />

      <section className="analysis-layout">
        {analysis.preview ? (
          <img className="analysis-photo" src={analysis.preview} alt="Analyzed outfit" />
        ) : (
          <div className="analysis-image" />
        )}
        <div className="analysis-panel glass-card">
          <div className="score-ring">
            <strong>{analysis.outfitScore}</strong>
            <span>Outfit score</span>
          </div>
          <div className="metric-grid">
            <div>
              <span>Color match</span>
              <strong>{analysis.colorMatch}</strong>
            </div>
            <div>
              <span>Occasion</span>
              <strong>{analysis.occasion}</strong>
            </div>
          </div>
          <div className="feedback-block">
            <h3>Fit suggestion</h3>
            <p>{analysis.fitSuggestion}</p>
          </div>
          <div className="feedback-block">
            <h3>Improvement tips</h3>
            <ul>
              {analysis.tips?.map((tip) => <li key={tip}>{tip}</li>)}
            </ul>
          </div>
          <div className="feedback-block">
            <h3>Recommended looks</h3>
            <ul>
              {analysis.recommendations?.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="button-row">
            <Link className="primary-button" to="/recommendations">See more outfits</Link>
            <Link className="secondary-button" to="/upload">Analyze another photo</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AnalysisPage;
