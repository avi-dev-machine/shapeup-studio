'use client';
import { useEffect, useState } from 'react';
import { api, adminApi } from '@/utils/api';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  const load = () => adminApi.getAllReviews().then(setReviews).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    await adminApi.deleteReview(id);
    load();
  };

  const handleApprove = async (id) => {
    await adminApi.approveReview(id);
    load();
  };

  return (
    <div>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
        Moderate user-submitted reviews. Approve reviews to make them visible on the public site.
      </p>

      {reviews.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px' }}>
          No reviews yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reviews.map((r) => (
            <div key={r.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px', opacity: r.is_approved ? 1 : 0.8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <strong>{r.author_name}</strong>
                  <span style={{ color: 'var(--color-primary)' }}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                  {!r.is_approved && (
                    <span style={{ backgroundColor: 'rgba(255, 193, 7, 0.2)', color: '#ffc107', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      PENDING
                    </span>
                  )}
                </div>
                {r.comment && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{r.comment}</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!r.is_approved && (
                  <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap' }} onClick={() => handleApprove(r.id)}>
                    Approve
                  </button>
                )}
                <button className="btn btn-danger" style={{ padding: '6px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap' }} onClick={() => handleDelete(r.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
