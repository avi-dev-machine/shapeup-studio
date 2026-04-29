'use client';
import { useEffect, useState } from 'react';
import { api, adminApi } from '@/utils/api';
import { Clock } from 'lucide-react';

export default function AdminHours() {
  const [hours, setHours] = useState([]);
  const [slotName, setSlotName] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => api.getHours().then(setHours).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { slot_name: slotName, time_range: timeRange, is_highlighted: isHighlighted };

      if (editing) {
        await adminApi.updateGymHour(editing.id, data);
      } else {
        await adminApi.createGymHour(data);
      }

      setSlotName('');
      setTimeRange('');
      setIsHighlighted(false);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hour) => {
    setEditing(hour);
    setSlotName(hour.slot_name);
    setTimeRange(hour.time_range);
    setIsHighlighted(hour.is_highlighted);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this time slot?')) return;
    await adminApi.deleteGymHour(id);
    load();
  };

  return (
    <div>
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>Manage Gym Hours</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
          Add or update operational hours. Checking "Highlighted" makes it stand out (e.g. Ladies Only).
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'end' }}>
          <div className="form-group" style={{ flex: '1 1 200px' }}>
            <label>Slot Name</label>
            <input className="form-input" value={slotName} onChange={(e) => setSlotName(e.target.value)} required placeholder="e.g. Morning" />
          </div>
          <div className="form-group" style={{ flex: '1 1 200px' }}>
            <label>Time Range</label>
            <input className="form-input" value={timeRange} onChange={(e) => setTimeRange(e.target.value)} required placeholder="e.g. 6:30 AM – 12:00 PM" />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px' }}>
            <input type="checkbox" checked={isHighlighted} onChange={(e) => setIsHighlighted(e.target.checked)} id="highlighted" style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }} />
            <label htmlFor="highlighted" style={{ margin: 0, cursor: 'pointer' }}>Highlighted</label>
          </div>
          <div style={{ display: 'flex', gap: '8px', paddingBottom: '4px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editing ? 'Update' : 'Add Slot'}
            </button>
            {editing && (
              <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setSlotName(''); setTimeRange(''); setIsHighlighted(false); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {hours.map((hour) => (
          <div key={hour.id} className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', border: hour.is_highlighted ? '1px solid var(--color-primary)' : '1px solid transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: hour.is_highlighted ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                <Clock size={20} />
              </div>
              <div>
                <h4 style={{ marginBottom: '4px', color: hour.is_highlighted ? 'var(--color-primary)' : 'var(--color-text)' }}>{hour.slot_name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{hour.time_range}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => handleEdit(hour)}>Edit</button>
              <button className="btn btn-danger" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => handleDelete(hour.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
