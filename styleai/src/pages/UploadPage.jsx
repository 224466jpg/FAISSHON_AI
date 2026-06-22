import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { sampleAnalysis } from '../data/styleData';
import { uploadAndAnalyzeOutfit } from '../services/fashionApi';

function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const chooseFile = (selectedFile) => {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) {
      setStatus('Please choose a JPG, PNG, or WEBP image.');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setAnalysis(null);
    setStatus('');
  };

  const handleAnalyze = async () => {
    if (!file) {
      setStatus('Choose an outfit photo first.');
      return;
    }

    setStatus('Analyzing outfit...');
    try {
      const result = await uploadAndAnalyzeOutfit(file);
      setAnalysis(result);
      localStorage.setItem('fashion-ai-last-analysis', JSON.stringify({
        ...result,
        preview,
      }));
      setStatus('Analysis complete.');
    } catch (error) {
      const fallback = { ...sampleAnalysis, preview };
      setAnalysis(fallback);
      localStorage.setItem('fashion-ai-last-analysis', JSON.stringify(fallback));
      setStatus(`${error.message} Showing sample AI output so the demo still works.`);
    }
  };

  return (
    <main className="page">
      <SectionHeader
        eyebrow="Upload studio"
        title="Upload your outfit photo"
        text="Preview your look before sending it to the AI analysis route."
      />

      <section className="upload-layout">
        <div
          className={`upload-zone ${isDragging ? 'is-dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            chooseFile(event.dataTransfer.files[0]);
          }}
        >
          {preview ? (
            <img src={preview} alt="Selected outfit preview" />
          ) : (
            <div>
              <span className="upload-icon">+</span>
              <h3>Drop your outfit photo here</h3>
              <p>or tap to browse your device</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(event) => chooseFile(event.target.files[0])}
          />
        </div>

        <aside className="analysis-card glass-card">
          <p className="eyebrow">Ready when you are</p>
          <h2>Analyze Outfit</h2>
          <p>
            The backend saves uploads with multer and returns an AI-ready placeholder response.
          </p>
          <button className="primary-button full-width" type="button" onClick={handleAnalyze}>
            Analyze Outfit
          </button>
          {status && <p className="status-text">{status}</p>}
          {analysis && (
            <div className="mini-results">
              <strong>{analysis.outfitScore}/100</strong>
              <span>{analysis.colorMatch} color match</span>
              <p>{analysis.tips?.[0]}</p>
              <Link className="text-link" to="/analysis">Open full analysis page</Link>
              <button className="secondary-button full-width" type="button" onClick={() => navigate('/analysis')}>
                View Detailed Result
              </button>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default UploadPage;
