'use client';
import { useEffect, useState } from 'react';
import { api, adminApi, getUploadUrl } from '@/utils/api';

export default function AdminLogo() {
  const [logo, setLogo] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getLogo().then(setLogo).catch(console.error);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const upload = await adminApi.uploadFile(file);
      const updated = await adminApi.updateLogo(upload.url);
      setLogo(updated);
      setFile(null);
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
        Upload or replace the site logo that appears in the navigation.
      </p>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'start', flexWrap: 'wrap' }}>
        {/* Current Logo */}
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center', minWidth: '200px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Current Logo</p>
          {logo?.logo_url ? (
            <img src={getUploadUrl(logo.logo_url)} alt="Site Logo" style={{ maxWidth: '200px', maxHeight: '100px', margin: '0 auto' }} />
          ) : (
            <div style={{ padding: '24px', color: 'var(--color-text-muted)' }}>No logo uploaded yet</div>
          )}
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>New Logo File</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="form-input" required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Uploading...' : saved ? '✓ Updated!' : 'Upload Logo'}
          </button>
        </form>
      </div>
    </div>
  );
}
