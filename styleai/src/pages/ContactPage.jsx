import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { sendContactMessage } from '../services/fashionApi';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('Sending message...');

    try {
      await sendContactMessage(form);
      setStatus('Message sent successfully.');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <SectionHeader
        eyebrow="Contact"
        title="Bring fashion intelligence into your next project"
        text="Use this form for feedback, demo requests, or portfolio contact."
      />

      <section className="contact-layout">
        <form className="contact-form glass-card" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(event) => updateForm('name', event.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(event) => updateForm('email', event.target.value)}
            required
          />
          <textarea
            placeholder="Tell us what you want to style"
            rows="6"
            value={form.message}
            onChange={(event) => updateForm('message', event.target.value)}
            required
          />
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          {status && <p className="status-text">{status}</p>}
        </form>
        <aside className="contact-card">
          <p className="eyebrow">Studio notes</p>
          <h3>Deployment ready structure</h3>
          <p>
            Frontend can deploy on Vercel. Backend can deploy on Render with MongoDB Atlas and
            your chosen AI provider key.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default ContactPage;
