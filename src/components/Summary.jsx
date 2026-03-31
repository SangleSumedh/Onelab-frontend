import { ISSUE_META } from './StatusBadge';

function Summary({ summary }) {
  if (!summary) return null;

  const matchRate = summary.matchPercentage ?? 0;
  const rateColor = matchRate >= 90 ? '#00B894' : matchRate >= 70 ? '#FDCB6E' : '#D63031';

  return (
    <section className="summary-section animate-in">
      <h2 className="section-title">
        <span className="section-icon">📊</span>
        Reconciliation Summary
      </h2>

      {/* Top-level metric cards */}
      <div className="metric-cards">
        <div className="metric-card glass">
          <span className="metric-label">Total Transactions</span>
          <span className="metric-value">{summary.totalTransactions?.toLocaleString()}</span>
        </div>
        <div className="metric-card glass">
          <span className="metric-label">Total Settlements</span>
          <span className="metric-value">{summary.totalSettlements?.toLocaleString()}</span>
        </div>
        <div className="metric-card glass highlight">
          <span className="metric-label">Match Rate</span>
          <span className="metric-value" style={{ color: rateColor }}>
            {matchRate.toFixed(1)}%
          </span>
          {/* Progress ring */}
          <svg className="progress-ring" width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="25" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
            <circle
              cx="30" cy="30" r="25"
              stroke={rateColor}
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${(matchRate / 100) * 157} 157`}
              strokeLinecap="round"
              transform="rotate(-90 30 30)"
              className="progress-fill"
            />
          </svg>
        </div>
        <div className="metric-card glass">
          <span className="metric-label">Exactly Matched</span>
          <span className="metric-value" style={{ color: '#00B894' }}>
            {summary.totalMatched?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Issue type breakdown */}
      <div className="breakdown-grid">
        {Object.entries(summary.countsByIssueType || {}).map(([type, count]) => {
          const meta = ISSUE_META[type] || { color: '#636E72', icon: '•', label: type };
          return (
            <div
              key={type}
              className="breakdown-item glass"
              style={{ borderLeftColor: meta.color }}
            >
              <span className="breakdown-icon" style={{ color: meta.color }}>{meta.icon}</span>
              <span className="breakdown-label">{meta.label}</span>
              <span className="breakdown-count" style={{ color: meta.color }}>{count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Summary;
