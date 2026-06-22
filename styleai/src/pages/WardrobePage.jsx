import { useEffect, useRef, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { wardrobeItems } from '../data/styleData';
import { getOutfits, saveOutfit } from '../services/fashionApi';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

function imageSource(item) {
  if (item.image) return item.image;
  if (item.imageUrl?.startsWith('/uploads')) return `${API_ORIGIN}${item.imageUrl}`;
  return item.imageUrl;
}

function WardrobePage() {
  const inputRef = useRef(null);
  const [savedLooks, setSavedLooks] = useState(wardrobeItems);
  const [status, setStatus] = useState('Loading wardrobe...');

  useEffect(() => {
    let mounted = true;

    getOutfits()
      .then((outfits) => {
        if (!mounted) return;
        const normalized = outfits.map((outfit) => ({
          name: outfit.title || 'Saved outfit',
          tag: outfit.occasion || 'Uploaded',
          image: imageSource(outfit),
          score: outfit.styleScore || 84,
        }));
        setSavedLooks([...normalized, ...wardrobeItems]);
        setStatus('Wardrobe ready.');
      })
      .catch((error) => {
        if (!mounted) return;
        setStatus(`${error.message} Showing demo wardrobe.`);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const saveLook = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setStatus('Please choose a valid outfit image.');
      return;
    }

    const previewLook = {
      name: 'New Saved Look',
      tag: 'Uploaded',
      image: URL.createObjectURL(file),
      score: 84,
    };

    setSavedLooks((items) => [previewLook, ...items]);
    localStorage.setItem(
      'fashion-ai-local-saves',
      String(Number(localStorage.getItem('fashion-ai-local-saves') || 0) + 1),
    );
    setStatus('Saving outfit...');

    try {
      const outfit = await saveOutfit(file, {
        title: 'New Saved Look',
        occasion: 'Everyday',
        tags: 'uploaded,wardrobe',
      });
      setSavedLooks((items) => [
        {
          name: outfit.title || 'New Saved Look',
          tag: outfit.occasion || 'Uploaded',
          image: imageSource(outfit),
          score: outfit.styleScore || 84,
        },
        ...items.filter((item) => item !== previewLook),
      ]);
      setStatus('Outfit saved to wardrobe.');
    } catch (error) {
      setStatus(`${error.message} Kept the outfit in this browser.`);
    }
  };

  return (
    <main className="page">
      <SectionHeader
        eyebrow="Wardrobe gallery"
        title="Save outfit images and build your closet"
        text="Upload images, save them to the backend, and keep building your AI wardrobe."
      />

      <div className="toolbar">
        <button className="primary-button" type="button" onClick={() => inputRef.current?.click()}>
          Save Outfit Image
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(event) => saveLook(event.target.files[0])}
          hidden
        />
        <p className="status-text">{status}</p>
      </div>

      <section className="wardrobe-grid">
        {savedLooks.map((item) => (
          <article className="wardrobe-card" key={`${item.name}-${item.image}`}>
            <img src={item.image} alt={item.name} />
            <div>
              <span>{item.tag}</span>
              <h3>{item.name}</h3>
              <p>Style score {item.score}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default WardrobePage;
