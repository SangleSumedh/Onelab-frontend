import { useState } from 'react';
import Summary from './components/Summary';
import MismatchTable from './components/MismatchTable';
import { generateData, reconcile, getReport, getSummary, getCsvUrl } from './services/api';
import './App.css';

function App() {
  const [summary, setSummary] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [genInfo, setGenInfo] = useState(null);
  const [count, setCount] = useState(500);
  const [anomalyRatio, setAnomalyRatio] = useState(0.15);

  async function handleGenerate() {
    setLoading('generate');
    setError(null);
    try {
      const data = await generateData(count, anomalyRatio);
      setGenInfo(data);
      setSummary(null);
      setResults([]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  async function handleReconcile() {
    setLoading('reconcile');
    setError(null);
    try {
      await reconcile();
      const [s, r] = await Promise.all([getSummary(), getReport()]);
      setSummary(s);
      setResults(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="app">
      {/* Ambient background effects */}
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-glow bg-glow-3" />

      <header className="app-header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="10" height="10" rx="2" fill="#6C5CE7" />
              <rect x="16" y="2" width="10" height="10" rx="2" fill="#A29BFE" opacity="0.7" />
              <rect x="2" y="16" width="10" height="10" rx="2" fill="#A29BFE" opacity="0.7" />
              <rect x="16" y="16" width="10" height="10" rx="2" fill="#6C5CE7" />
            </svg>
          </div>
          <h1>Onelab <span className="accent">Recon</span></h1>
        </div>
        <p className="subtitle">Payment Reconciliation Engine</p>
      </header>

      <main className="app-main">
        {/* Controls */}
        <section className="controls-section">
          <div className="controls-card glass">
            <h2 className="section-title">
              <span className="section-icon">⚙</span>
              Configuration
            </h2>
            <div className="controls-grid">
              <div className="input-group">
                <label htmlFor="count">Transactions</label>
                <input
                  id="count"
                  type="number"
                  min="10"
                  max="100000"
                  value={count}
                  onChange={e => setCount(parseInt(e.target.value) || 500)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="ratio">Anomaly Ratio</label>
                <input
                  id="ratio"
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={anomalyRatio}
                  onChange={e => setAnomalyRatio(parseFloat(e.target.value) || 0.15)}
                />
              </div>
              <div className="button-group">
                <button
                  className="btn btn-primary"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading === 'generate' ? (
                    <span className="spinner" />
                  ) : (
                    <span className="btn-icon">⬢</span>
                  )}
                  Generate Data
                </button>
                <button
                  className="btn btn-accent"
                  onClick={handleReconcile}
                  disabled={loading || !genInfo}
                >
                  {loading === 'reconcile' ? (
                    <span className="spinner" />
                  ) : (
                    <span className="btn-icon">⚡</span>
                  )}
                  Run Reconciliation
                </button>
                {summary && (
                  <a
                    className="btn btn-outline"
                    href={getCsvUrl()}
                    download
                  >
                    <span className="btn-icon">↓</span>
                    Export CSV
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Error display */}
        {error && (
          <div className="error-banner glass">
            <span className="error-icon">⚠</span>
            {error}
            <button className="error-dismiss" onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Generation info */}
        {genInfo && !summary && (
          <section className="gen-info glass animate-in">
            <div className="gen-stat">
              <span className="gen-label">Transactions</span>
              <span className="gen-value">{genInfo.transactionCount?.toLocaleString()}</span>
            </div>
            <div className="gen-divider" />
            <div className="gen-stat">
              <span className="gen-label">Settlements</span>
              <span className="gen-value">{genInfo.settlementCount?.toLocaleString()}</span>
            </div>
            <div className="gen-divider" />
            <div className="gen-stat">
              <span className="gen-label">Anomalies</span>
              <span className="gen-value">
                {genInfo.anomaliesInjected
                  ? Object.values(genInfo.anomaliesInjected).reduce((a, b) => a + b, 0)
                  : 0}
              </span>
            </div>
            <p className="gen-hint">Click "Run Reconciliation" to analyze</p>
          </section>
        )}

        {/* Summary + Results */}
        {summary && (
          <>
            <Summary summary={summary} />
            <MismatchTable results={results} />
          </>
        )}

        {/* Empty state */}
        {!genInfo && !summary && (
          <section className="empty-state animate-in">
            <div className="empty-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="35" stroke="#6C5CE7" strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />
                <path d="M30 45 L37 52 L52 32" stroke="#6C5CE7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Ready to Reconcile</h3>
            <p>Generate a dataset and run the reconciliation engine to detect mismatches.</p>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>Onelab Recon — Payment Reconciliation System</p>
      </footer>
    </div>
  );
}

export default App;
