export default function ParkingMap({ slots, onSlotClick, interactive = false }) {
  const getSlotColor = (status) => {
    switch (status) {
      case 'Available': return { bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981', text: '#34d399' };
      case 'Occupied': return { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#f87171' };
      case 'Reserved': return { bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b', text: '#fbbf24' };
      default: return { bg: 'rgba(107, 114, 148, 0.2)', border: '#6b7294', text: '#a0a8c8' };
    }
  };

  const getTypeIcon = (type) => type === 'Bike' ? '🏍️' : '🚗';

  // Group by level
  const levels = {};
  slots.forEach(s => {
    const lvl = s.slot_level || 1;
    if (!levels[lvl]) levels[lvl] = [];
    levels[lvl].push(s);
  });

  return (
    <div>
      {Object.keys(levels).sort().map(level => (
        <div key={level} style={{ marginBottom: '24px' }}>
          <div style={{
            fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--accent-blue)', display: 'inline-block'
            }} />
            Level {level}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '12px'
          }}>
            {levels[level].map(slot => {
              const colors = getSlotColor(slot.slot_status);
              return (
                <div
                  key={slot.slot_id}
                  onClick={() => interactive && onSlotClick?.(slot)}
                  style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px 12px',
                    textAlign: 'center',
                    cursor: interactive ? 'pointer' : 'default',
                    transition: 'var(--transition)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    if (interactive) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = `0 0 15px ${colors.border}40`;
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{getTypeIcon(slot.slot_type)}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: colors.text }}>
                    S-{slot.slot_id}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {slot.slot_type} • {slot.slot_priority}
                  </div>
                  <span className={`badge badge-${slot.slot_status?.toLowerCase()}`} style={{ marginTop: '8px', fontSize: '10px' }}>
                    {slot.slot_status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div style={{
        display: 'flex', gap: '20px', marginTop: '20px', padding: '12px 16px',
        background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-glass)', fontSize: '12px'
      }}>
        {['Available', 'Occupied', 'Reserved'].map(status => {
          const colors = getSlotColor(status);
          return (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '10px', height: '10px', borderRadius: '2px',
                background: colors.border, display: 'inline-block'
              }} />
              <span style={{ color: 'var(--text-secondary)' }}>{status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
