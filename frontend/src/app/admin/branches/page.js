'use client';
import { useEffect, useState } from 'react';
import { api, adminApi, getUploadUrl } from '@/utils/api';

export default function AdminBranches() {
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => api.getBranches().then(setBranches).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let photoUrl = '';
      if (photoFile) {
        const upload = await adminApi.uploadFile(photoFile);
        photoUrl = upload.url;
      }

      const data = { name, address, maps_url: mapsUrl };
      if (photoUrl) data.photo_url = photoUrl;

      if (editing) {
        await adminApi.updateBranch(editing.id, data);
      } else {
        await adminApi.createBranch(data);
      }

      setName('');
      setAddress('');
      setMapsUrl('');
      setPhotoFile(null);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (branch) => {
    setEditing(branch);
    setName(branch.name || '');
    setAddress(branch.address || '');
    setMapsUrl(branch.maps_url || '');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this branch?')) return;
    await adminApi.deleteBranch(id);
    load();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: '1 1 200px' }}>
            <label>Branch Name</label>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., KASBA" />
          </div>
          <div className="form-group" style={{ flex: '1 1 200px' }}>
            <label>Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="form-input" />
          </div>
        </div>
        <div className="form-group">
          <label>Address</label>
          <input className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Full address" />
        </div>
        <div className="form-group">
          <label>Google Maps URL</label>
          <input className="form-input" value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} placeholder="https://maps.google.com/..." />
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : editing ? 'Update Branch' : 'Add Branch'}
          </button>
          {editing && (
            <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setName(''); setAddress(''); setMapsUrl(''); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {branches.map((b) => (
          <div key={b.id} className="glass-card" style={{ padding: '20px' }}>
            {b.photo_url ? (
              <img src={getUploadUrl(b.photo_url)} alt={b.name} style={{ width: '100%', height: '120px', borderRadius: '8px', objectFit: 'cover', marginBottom: '16px' }} />
            ) : (
              <div style={{ width: '100%', height: '120px', borderRadius: '8px', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '1rem', color: 'var(--color-text-muted)' }}>
                No Photo
              </div>
            )}
            <h4 style={{ marginBottom: '8px' }}>{b.name}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{b.address}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.8rem', flex: 1 }} onClick={() => handleEdit(b)}>Edit</button>
              <button className="btn btn-danger" style={{ padding: '6px 16px', fontSize: '0.8rem', flex: 1 }} onClick={() => handleDelete(b.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
