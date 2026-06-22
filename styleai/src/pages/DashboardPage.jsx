import { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { sampleAnalysis } from '../data/styleData';
import { getStats } from '../services/fashionApi';

function readLatestAnalysis() {
  try {
    return JSON.parse(localStorage.getItem('fashion-ai-last-analysis') || 'null');
  } catch {
    return null;
  }
}

function DashboardPage() {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    savedLooks: 0,
    bestStyleScore: 85,
    recentRecommendations: sampleAnalysis.recommendations.length,
  });
  const [status, setStatus] = useState('Loading dashboard...');

  useEffect(() => {
    let mounted = true;

    getStats()
      .then((data) => {
        if (!mounted) return;
        const latest = readLatestAnalysis();
        setStats({
          totalAnalyses: data.totalAnalyses || (latest ? 1 : 0),
          savedLooks: Number(localStorage.getItem('fashion-ai-local-saves') || 0),
          bestStyleScore: data.averageScore || latest?.outfitScore || 85,
          recentRecommendations: latest?.recommendations?.length || sampleAnalysis.recommendations.length,
        });
        setStatus('Dashboard ready.');
      })
      .catch((error) => {
        if (!mounted) return;
        const latest = readLatestAnalysis();
        setStats((current) => ({
          ...current,
          totalAnalyses: latest ? 1 : 0,
          bestStyleScore: latest?.outfitScore || 85,
        }));
        setStatus(`${error.message} Showing local dashboard data.`);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const statCards = [
    { label: 'Total outfits analyzed', value: stats.totalAnalyses },
    { label: 'Saved looks', value: stats.savedLooks },
    { label: 'Best style score', value: stats.bestStyleScore },
    { label: 'Recent recommendations', value: stats.recentRecommendations },
  ];

  return (
    <main className="page">
      <SectionHeader
        eyebrow="User dashboard"
        title="Your styling progress at a glance"
        text="Track outfit analysis, saved looks, and recent recommendation activity."
      />
      <p className="status-text">{status}</p>

      <section className="stats-grid">
        {statCards.map((stat) => (
          <article className="stat-card glass-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-layout">
        <div className="glass-card">
          <h3>Recent recommendations</h3>
          <ul className="pretty-list">
            {sampleAnalysis.recommendations.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="glass-card">
          <h3>Best style note</h3>
          <p>
            Your strongest outfits use neutral foundations with one premium accent. Keep building
            around beige, black, white, soft pink, and gold accessories.
          </p>
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
