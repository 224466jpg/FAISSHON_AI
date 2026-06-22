import { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { placeOrder } from '../services/fashionApi';

function priceNumber(price) {
  return Number(String(price).replace(/[^0-9.]/g, '')) || 0;
}

function storeOrder(order) {
  const existing = JSON.parse(localStorage.getItem('styleai-orders') || '[]');
  localStorage.setItem('styleai-orders', JSON.stringify([order, ...existing]));
}

function CartPage({ cartItems, onUpdateQuantity, onRemove, onClear }) {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const subtotal = cartItems.reduce(
    (total, item) => total + priceNumber(item.price) * item.quantity,
    0,
  );
  const stylingFee = cartItems.length > 0 ? 9 : 0;
  const total = subtotal + stylingFee;

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const submitOrder = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      setStatus('Add items before placing an order.');
      return;
    }

    setLoading(true);
    setStatus('Placing your order...');

    const orderPayload = {
      customer,
      items: cartItems.map((item) => ({
        productId: String(item.id),
        name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      stylingFee,
      total,
    };

    try {
      const order = await placeOrder(orderPayload);
      storeOrder(order);
      setConfirmation(order);
      setStatus('Order placed successfully.');
      onClear();
    } catch (error) {
      const fallbackOrder = {
        _id: `local-order-${Date.now()}`,
        ...orderPayload,
        status: 'Placed locally',
        createdAt: new Date().toISOString(),
      };
      storeOrder(fallbackOrder);
      setConfirmation(fallbackOrder);
      setStatus(`${error.message} Saved this order locally.`);
      onClear();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <SectionHeader
        eyebrow="Cart"
        title="Your shopping bag"
        text="Review your fashion picks, adjust quantities, and place your clothing order."
      />

      {confirmation && (
        <section className="order-confirmation glass-card">
          <span>Order confirmed</span>
          <h3>Order #{String(confirmation._id).slice(-8)}</h3>
          <p>
            Your clothes order has been stored. You can continue shopping or place another order.
          </p>
          <Link className="primary-button" to="/shopping">Continue Shopping</Link>
        </section>
      )}

      {cartItems.length === 0 && !confirmation ? (
        <section className="empty-cart glass-card">
          <h3>Your cart is empty</h3>
          <p>Add pieces from shopping or recommendations to build your look.</p>
          <Link className="primary-button" to="/shopping">Start Shopping</Link>
        </section>
      ) : cartItems.length > 0 ? (
        <section className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => (
              <article className="cart-item glass-card" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <span>{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{item.colors?.join(' / ')}</p>
                  <strong>{item.price}</strong>
                </div>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    aria-label={`Decrease ${item.name}`}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    aria-label={`Increase ${item.name}`}
                  >
                    +
                  </button>
                </div>
                <button className="text-button" type="button" onClick={() => onRemove(item.id)}>
                  Remove
                </button>
              </article>
            ))}
          </div>

          <aside className="checkout-card glass-card">
            <h3>Order summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="summary-row">
              <span>AI styling fee</span>
              <strong>${stylingFee.toFixed(2)}</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <form className="checkout-form" onSubmit={submitOrder}>
              <input
                type="text"
                placeholder="Full name"
                value={customer.name}
                onChange={(event) => updateCustomer('name', event.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={customer.email}
                onChange={(event) => updateCustomer('email', event.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={customer.phone}
                onChange={(event) => updateCustomer('phone', event.target.value)}
                required
              />
              <textarea
                placeholder="Delivery address"
                rows="3"
                value={customer.address}
                onChange={(event) => updateCustomer('address', event.target.value)}
                required
              />
              <button className="primary-button full-width" type="submit" disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
              <button className="secondary-button full-width" type="button" onClick={onClear}>
                Clear Cart
              </button>
              {status && <p className="status-text">{status}</p>}
            </form>
          </aside>
        </section>
      ) : null}
    </main>
  );
}

export default CartPage;
