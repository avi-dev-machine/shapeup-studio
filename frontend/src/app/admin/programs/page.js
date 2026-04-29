'use client';
import { useEffect, useState } from 'react';
import { api, adminApi } from '@/utils/api';
import { ListTodo } from 'lucide-react';

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => api.getPrograms().then(setPrograms).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { name, display_order: displayOrder };

      if (editing) {
        await adminApi.updateProgram(editing.id, data);
      } else {
        await adminApi.createProgram(data);
      }

      setName('');
      setDisplayOrder(0);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prog) => {
    setEditing(prog);
    setName(prog.name);
    setDisplayOrder(prog.display_order);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this program?')) return;
    await adminApi.deleteProgram(id);
    load();
  };

  return (
    <div>
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>Manage Special Programs</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
          These items will appear in the Special Programs section on the landing page.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'end' }}>
          <div className="form-group" style={{ flex: '1 1 200px' }}>
            <label>Program Name</label>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Kickboxing" />
          </div>
          <div className="form-group" style={{ flex: '0 1 100px' }}>
            <label>Order</label>
            <input type="number" className="form-input" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value))} />
          </div>
          <div style={{ display: 'flex', gap: '8px', paddingBottom: '4px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editing ? 'Update' : 'Add Program'}
            </button>
            {editing && (
              <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setName(''); setDisplayOrder(0); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {programs.map((prog) => (
          <div key={prog.id} className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <ListTodo size={20} />
              </div>
              <div>
                <h4 style={{ marginBottom: '4px' }}>{prog.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Order: {prog.display_order}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => handleEdit(prog)}>Edit</button>
              <button className="btn btn-danger" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => handleDelete(prog.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
