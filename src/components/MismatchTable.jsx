import { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';

function MismatchTable({ results }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const issueTypes = useMemo(() => {
    const types = new Set(results.map(r => r.issueType));
    return ['ALL', ...Array.from(types).sort()];
  }, [results]);

  const filtered = useMemo(() => {
    return results.filter(r => {
      if (filter !== 'ALL' && r.issueType !== filter) return false;
      if (search && !r.transactionId?.toLowerCase().includes(search.toLowerCase()) &&
        !r.explanation?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [results, filter, search]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageResults = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function formatAmount(val) {
    if (val == null) return '—';
    return `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function formatDate(val) {
    if (!val) return '—';
    return new Date(val).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  if (!results.length) return null;

  return (
    <section className="table-section animate-in">
      <h2 className="section-title">
        <span className="section-icon">📋</span>
        Detailed Results
        <span className="result-count">{filtered.length} items</span>
      </h2>

      {/* Filters */}
      <div className="table-controls glass">
        <div className="filter-pills">
          {issueTypes.map(type => (
            <button
              key={type}
              className={`pill ${filter === type ? 'active' : ''}`}
              onClick={() => { setFilter(type); setPage(0); }}
            >
              {type === 'ALL' ? 'All Types' : type.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Search by ID or explanation..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
        />
      </div>

      {/* Table */}
      <div className="table-wrapper glass">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Settlement ID</th>
              <th>Issue Type</th>
              <th>Expected</th>
              <th>Actual</th>
              <th>Txn Date</th>
              <th>Settle Date</th>
              <th>Explanation</th>
            </tr>
          </thead>
          <tbody>
            {pageResults.map((r, i) => (
              <tr key={`${r.transactionId}-${r.settlementId}-${i}`} className="table-row">
                <td className="mono">{r.transactionId}</td>
                <td className="mono">{r.settlementId || '—'}</td>
                <td><StatusBadge issueType={r.issueType} /></td>
                <td className="amount">{formatAmount(r.expectedAmount)}</td>
                <td className="amount">{formatAmount(r.actualAmount)}</td>
                <td className="date">{formatDate(r.transactionDate)}</td>
                <td className="date">{formatDate(r.settlementDate)}</td>
                <td className="explanation">{r.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            ← Prev
          </button>
          <span className="page-info">
            Page {page + 1} of {pageCount}
          </span>
          <button
            className="page-btn"
            disabled={page >= pageCount - 1}
            onClick={() => setPage(p => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}

export default MismatchTable;
