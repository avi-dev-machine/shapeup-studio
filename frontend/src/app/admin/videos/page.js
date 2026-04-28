'use client';
import { useEffect, useState } from 'react';
import { api, adminApi } from '@/utils/api';
import { Video } from 'lucide-react';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => api.getVideos().then(setVideos).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { title, video_url: videoUrl, display_order: displayOrder };

      if (editing) {
        await adminApi.updateVideo(editing.id, data);
      } else {
        await adminApi.createVideo(data);
      }

      setTitle('');
      setVideoUrl('');
      setDisplayOrder(0);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video) => {
    setEditing(video);
    setTitle(video.title);
    setVideoUrl(video.video_url);
    setDisplayOrder(video.display_order);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this video?')) return;
    await adminApi.deleteVideo(id);
    load();
  };

  return (
    <div>
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>Add Workout Video</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
          Paste a YouTube URL or direct MP4 link. YouTube links will automatically be embedded.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
          <div className="form-group">
            <label>Video Title</label>
            <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Intense Cardio Burn" />
          </div>
          <div className="form-group">
            <label>Video URL (YouTube or MP4)</label>
            <input className="form-input" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required placeholder="https://youtube.com/watch?v=..." />
          </div>
          <div className="form-group">
            <label>Display Order</label>
            <input type="number" className="form-input" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value))} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editing ? 'Update Video' : 'Add Video'}
            </button>
            {editing && (
              <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setTitle(''); setVideoUrl(''); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {videos.map((v) => (
          <div key={v.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ width: '100%', height: '180px', background: 'var(--color-surface)', marginBottom: '16px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video size={48} color="var(--color-text-muted)" />
            </div>
            <h4 style={{ marginBottom: '4px' }}>{v.title}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', wordBreak: 'break-all', marginBottom: '8px' }}>{v.video_url}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginBottom: '16px' }}>Order: {v.display_order}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.8rem', flex: 1 }} onClick={() => handleEdit(v)}>Edit</button>
              <button className="btn btn-danger" style={{ padding: '6px 16px', fontSize: '0.8rem', flex: 1 }} onClick={() => handleDelete(v.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
