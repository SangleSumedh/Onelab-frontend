const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function generateData(count = 500, anomalyRatio = 0.15) {
  const res = await fetch(`${API_BASE}/generate-data?count=${count}&anomalyRatio=${anomalyRatio}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Generate failed: ${res.statusText}`);
  return res.json();
}

export async function reconcile() {
  const res = await fetch(`${API_BASE}/reconcile`, { method: 'POST' });
  if (!res.ok) throw new Error(`Reconcile failed: ${res.statusText}`);
  return res.json();
}

export async function getSummary() {
  const res = await fetch(`${API_BASE}/summary`);
  if (!res.ok) throw new Error(`Summary failed: ${res.statusText}`);
  return res.json();
}

export async function getReport() {
  const res = await fetch(`${API_BASE}/report`);
  if (!res.ok) throw new Error(`Report failed: ${res.statusText}`);
  return res.json();
}

export function getCsvUrl() {
  return `${API_BASE}/report/csv`;
}
