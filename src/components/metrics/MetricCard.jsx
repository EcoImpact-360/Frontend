import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

// Shows a single metric value with optional icon and trend indicator.
function MetricCard({ title, value, type = 'number', icon, trend }) {
  // Formats the metric value based on the requested display type.
  const formatValue = () => {
    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      default:
        return formatNumber(value);
    }
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <span style={{ color: '#666', fontSize: '0.875rem' }}>{title}</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {formatValue()}
        </span>
        {icon && <span style={{ fontSize: '1.5rem' }}>{icon}</span>}
      </div>
      {trend !== undefined && (
        <span style={{
          color: trend >= 0 ? '#22c55e' : '#ef4444',
          fontSize: '0.875rem'
        }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  );
}

export default MetricCard;
