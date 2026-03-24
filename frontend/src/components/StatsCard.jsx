export default function StatsCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <div className={`glass-card animate-fade-in animate-fade-in-delay-${delay}`} style={{
      display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px'
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
        background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{value}</div>
      </div>
    </div>
  );
}
