'use client';
import { useEffect, useState } from 'react';
import { api, adminApi, getUploadUrl } from '@/utils/api';

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [loading, setLoading] = useState(false);

  const load = () => api.getGallery().then(setItems).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const upload = await adminApi.uploadFile(file);
      await adminApi.addGalleryItem({ media_type: mediaType, url: upload.url, caption });
      setFile(null);
      setCaption('');
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    await adminApi.deleteGalleryItem(id);
    load();
  };

  return (
    <div>
      <form onSubmit={handleUpload} style={{ marginBottom: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
        <div className="form-group" style={{ minWidth: '200px' }}>
          <label>File (Image/Video)</label>
          <input type="file" accept="image/*,video/*" onChange={(e) => {
            setFile(e.target.files[0]);
            const f = e.target.files[0];
            if (f && f.type.startsWith('video')) setMediaType('video');
            else setMediaType('image');
          }} className="form-input" required />
        </div>
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Caption (optional)</label>
          <input className="form-input" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Describe this media" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Add to Gallery'}
        </button>
      </form>

      {items.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px' }}>
          Gallery is empty. Upload photos and videos!
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {items.map((item) => (
            <div key={item.id} className="glass-card" style={{ padding: '12px', position: 'relative' }}>
              {item.media_type === 'video' ? (
                <video src={getUploadUrl(item.url)} style={{ width: '100%', borderRadius: '8px', aspectRatio: '4/3', objectFit: 'cover' }} muted />
              ) : (
                <img src={getUploadUrl(item.url)} alt={item.caption} style={{ width: '100%', borderRadius: '8px', aspectRatio: '4/3', objectFit: 'cover' }} />
              )}
              {item.caption && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>{item.caption}</p>}
              <button className="btn btn-danger" style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => handleDelete(item.id)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
