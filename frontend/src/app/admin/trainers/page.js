'use client';
import { useEffect, useState } from 'react';
import { api, adminApi, getUploadUrl } from '@/utils/api';
import { CheckCircle, XCircle, User } from 'lucide-react';

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [name, setName] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [isMarquee, setIsMarquee] = useState(true);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => api.getTrainers().then(setTrainers).catch(console.error);
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

      if (editing) {
        const data = { name, is_in_marquee: isMarquee };
        if (photoUrl) data.photo_url = photoUrl;
        await adminApi.updateTrainer(editing.id, data);
      } else {
        await adminApi.createTrainer({ name, photo_url: photoUrl, is_in_marquee: isMarquee });
      }

      setName('');
      setPhotoFile(null);
      setIsMarquee(true);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trainer) => {
    setEditing(trainer);
    setName(trainer.name);
    setIsMarquee(trainer.is_in_marquee);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this trainer?')) return;
    await adminApi.deleteTrainer(id);
    load();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'end' }}>
        <div className="form-group" style={{ flex: '1 1 200px' }}>
          <label>Trainer Name</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter name" />
        </div>
        <div className="form-group" style={{ flex: '1 1 200px' }}>
            <label>Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="form-input" />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" id="marquee-toggle" checked={isMarquee} onChange={(e) => setIsMarquee(e.target.checked)} />
          <label htmlFor="marquee-toggle" style={{ marginBottom: 0 }}>In Marquee</label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : editing ? 'Update' : 'Add Trainer'}
        </button>
        {editing && (
          <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setName(''); }}>
            Cancel
          </button>
        )}
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {trainers.map((t) => (
          <div key={t.id} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            {t.photo_url ? (
              <img src={getUploadUrl(t.photo_url)} alt={t.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px' }} />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--color-primary)' }}>
                <User size={32} />
              </div>
            )}
            <h4 style={{ marginBottom: '4px' }}>{t.name}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              {t.is_in_marquee ? <><CheckCircle size={14} color="var(--color-primary)" /> In Marquee</> : <><XCircle size={14} color="var(--color-danger)" /> Not in Marquee</>}
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => handleEdit(t)}>Edit</button>
              <button className="btn btn-danger" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => handleDelete(t.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
