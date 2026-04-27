'use client';
import { useEffect, useState } from 'react';
import { api, adminApi } from '@/utils/api';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  const load = () => api.getReviews().then(setReviews).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    await adminApi.deleteReview(id);
    load();
  };

  return (
    <div>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
        Moderate user-submitted reviews. Delete inappropriate content.
      </p>

      {reviews.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px' }}>
          No reviews yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reviews.map((r) => (
            <div key={r.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <strong>{r.author_name}</strong>
                  <span style={{ color: 'var(--color-primary)' }}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                {r.comment && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{r.comment}</p>}
              </div>
              <button className="btn btn-danger" style={{ padding: '6px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap' }} onClick={() => handleDelete(r.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
