import { useMemo, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { shoppingItems } from '../data/shoppingItems';

const categories = ['All', ...new Set(shoppingItems.map((item) => item.category))];

function ShoppingPage({ onAddToCart }) {
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('');

  const products = useMemo(() => (
    category === 'All'
      ? shoppingItems
      : shoppingItems.filter((item) => item.category === category)
  ), [category]);

  const addProduct = (product) => {
    onAddToCart(product);
    setStatus(`${product.name} added to cart.`);
  };

  return (
    <main className="page">
      <SectionHeader
        eyebrow="Shopping"
        title="Shop AI-approved fashion pieces"
        text="Add premium wardrobe basics and styling upgrades directly to your cart."
      />

      <div className="shop-toolbar">
        <div className="chip-row">
          {categories.map((item) => (
            <button
              className={category === item ? 'chip selected' : 'chip'}
              type="button"
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        {status && <p className="status-text">{status}</p>}
      </div>

      <section className="shop-grid">
        {products.map((product) => (
          <article className="shop-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <div>
              <span>{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.tag} · {product.colors.slice(0, 2).join(' / ')}</p>
              <div className="price-row">
                <strong>{product.price}</strong>
                <button className="primary-button" type="button" onClick={() => addProduct(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default ShoppingPage;
