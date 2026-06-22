import { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { recommendationGroups } from '../data/styleData';
import { shoppingItems } from '../data/shoppingItems';
import { getRecommendations } from '../services/fashionApi';

function normalizeRecommendations(items) {
  if (!Array.isArray(items) || items.length === 0) return recommendationGroups;

  return items.map((item, index) => ({
    mood: item.mood || item.occasion || item.style || recommendationGroups[index % recommendationGroups.length].mood,
    image: getSafeImage(item, index),
    looks: item.looks || item.ideas || item.recommendations || [
      item.analysis || 'Build the look around one refined hero piece.',
      item.improvements?.[0] || 'Add clean accessories and balanced footwear.',
    ],
  }));
}

function getSafeImage(item, index) {
  const fallback = recommendationGroups[index % recommendationGroups.length].image;
  const candidate = item.image || item.imageUrl || item.suggestions?.[0]?.imageUrl;

  if (!candidate || candidate.includes('...') || candidate.includes('example.com')) {
    return fallback;
  }

  if (candidate.startsWith('/uploads')) {
    return `http://localhost:5000${candidate}`;
  }

  return candidate;
}

function recommendationProduct(group, index) {
  const base = shoppingItems[index % shoppingItems.length];

  return {
    ...base,
    id: `rec-${group.mood}-${base.id}`,
    name: group.looks[0],
    category: group.mood,
    image: group.image,
    tag: 'AI Pick',
  };
}

function RecommendationsPage({ onAddToCart }) {
  const [groups, setGroups] = useState(recommendationGroups);
  const [status, setStatus] = useState('Loading AI-ready recommendations...');
  const [cartStatus, setCartStatus] = useState('');

  useEffect(() => {
    let mounted = true;

    getRecommendations()
      .then((items) => {
        if (!mounted) return;
        setGroups(normalizeRecommendations(items));
        setStatus('Recommendations loaded.');
      })
      .catch((error) => {
        if (!mounted) return;
        setStatus(`${error.message} Showing curated recommendations.`);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="page">
      <SectionHeader
        eyebrow="Outfit recommendations"
        title="Looks for every occasion"
        text="Casual, formal, party, college, date, and interview styling ideas."
      />
      <p className="status-text">{status}</p>

      <section className="recommendation-grid">
        {groups.map((group, index) => (
          <article className="look-card" key={`${group.mood}-${group.looks[0]}`}>
            <img src={group.image} alt={`${group.mood} outfit inspiration`} />
            <div>
              <span>{group.mood}</span>
              <h3>{group.looks[0]}</h3>
              <p>{group.looks[1]}</p>
              <button
                className="primary-button full-width"
                type="button"
                onClick={() => {
                  const product = recommendationProduct(group, index);
                  onAddToCart(product);
                  setCartStatus(`${product.name} added to cart.`);
                }}
              >
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </section>
      {cartStatus && <p className="status-text">{cartStatus}</p>}
    </main>
  );
}

export default RecommendationsPage;
