'use client';
import { useEffect, useState } from 'react';
import { api, adminApi, getUploadUrl } from '@/utils/api';

export default function AdminOwner() {
  const [owner, setOwner] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getOwner().then((data) => {
      setOwner(data);
      setName(data.name);
      setDescription(data.description);
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { name, description };
      if (photoFile) {
        const upload = await adminApi.uploadFile(photoFile);
        data.photo_url = upload.url;
      }
      const updated = await adminApi.updateOwner(data);
      setOwner(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
        Edit the &quot;Meet the Founder&quot; section on the homepage.
      </p>

      {owner && (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Photo Preview */}
          <div>
            {owner.photo_url ? (
              <img src={getUploadUrl(owner.photo_url)} alt={owner.name} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', border: '2px solid var(--color-border)' }} />
            ) : (
              <div style={{ width: '200px', height: '200px', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'var(--color-primary)', opacity: 0.3, border: '2px solid var(--color-border)' }}>
                DD
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Name</label>
              <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Photo</label>
              <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="form-input" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'start' }}>
              {loading ? 'Saving...' : saved ? '✓ Saved!' : 'Update Owner'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
