const ISSUE_META = {
  Matched:                  { color: '#00B894', bg: 'rgba(0,184,148,0.12)', icon: '✓', label: 'Matched' },
  DelayedSettlement:        { color: '#FDCB6E', bg: 'rgba(253,203,110,0.12)', icon: '⏱', label: 'Delayed' },
  AmountMismatch:           { color: '#E17055', bg: 'rgba(225,112,85,0.12)', icon: '≠', label: 'Amount Mismatch' },
  Duplicate:                { color: '#6C5CE7', bg: 'rgba(108,92,231,0.12)', icon: '⧉', label: 'Duplicate' },
  MissingSettlement:        { color: '#D63031', bg: 'rgba(214,48,49,0.12)', icon: '✕', label: 'Missing' },
  OrphanSettlement:         { color: '#0984E3', bg: 'rgba(9,132,227,0.12)', icon: '?', label: 'Orphan' },
  RefundWithoutTransaction: { color: '#E84393', bg: 'rgba(232,67,147,0.12)', icon: '↩', label: 'Refund Ghost' },
};

function StatusBadge({ issueType }) {
  const meta = ISSUE_META[issueType] || { color: '#636E72', bg: 'rgba(99,110,114,0.12)', icon: '•', label: issueType };

  return (
    <span
      className="status-badge"
      style={{
        color: meta.color,
        backgroundColor: meta.bg,
        borderColor: meta.color,
      }}
    >
      <span className="badge-icon">{meta.icon}</span>
      {meta.label}
    </span>
  );
}

export default StatusBadge;
export { ISSUE_META };
