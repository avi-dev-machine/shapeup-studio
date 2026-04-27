'use client';
import { useEffect, useState } from 'react';
import { api, adminApi } from '@/utils/api';
import { PACKAGE_CATEGORIES } from '@/utils/constants';

export default function AdminPricing() {
  const [packages, setPackages] = useState([]);
  const [activeTab, setActiveTab] = useState('gym');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ category: 'gym', title: '', price: '', duration: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const load = () => api.getPackages().then(setPackages).catch(console.error);
  useEffect(() => { load(); }, []);

  const filtered = packages.filter((p) => p.category === activeTab);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, price: parseInt(form.price) };
      if (editing) {
        await adminApi.updatePackage(editing.id, data);
      } else {
        await adminApi.createPackage(data);
      }
      resetForm();
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg) => {
    setEditing(pkg);
    setForm({ category: pkg.category, title: pkg.title, price: pkg.price.toString(), duration: pkg.duration, notes: pkg.notes });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this package?')) return;
    await adminApi.deletePackage(id);
    load();
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ category: activeTab, title: '', price: '', duration: '', notes: '' });
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {PACKAGE_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`btn ${activeTab === cat.key ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 20px', fontSize: '0.8rem' }}
            onClick={() => { setActiveTab(cat.key); resetForm(); setForm(f => ({ ...f, category: cat.key })); }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', alignItems: 'end' }}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Package title" />
        </div>
        <div className="form-group">
          <label>Price (₹)</label>
          <input type="number" className="form-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="Amount" />
        </div>
        <div className="form-group">
          <label>Duration</label>
          <input className="form-input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 1 Month" />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <input className="form-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : editing ? 'Update' : 'Add Package'}
        </button>
        {editing && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>}
      </form>

      {/* Package List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((pkg) => (
          <div key={pkg.id} className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ marginBottom: '4px' }}>{pkg.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {pkg.duration} {pkg.notes && `· ${pkg.notes}`}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="text-accent text-glow" style={{ fontSize: '1.5rem' }}>₹{pkg.price.toLocaleString()}</span>
              <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => handleEdit(pkg)}>Edit</button>
              <button className="btn btn-danger" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => handleDelete(pkg.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
