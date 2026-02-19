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
    <div className="metric-card">
      <span className="metric-title">{title}</span>
      <div className="metric-value-container">
        <span className="metric-value">
          {formatValue()}
        </span>
        {icon && <span className="metric-icon">{icon}</span>}
      </div>
      {trend !== undefined && (
        <span className={`metric-trend ${trend >= 0 ? 'trend-up' : 'trend-down'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  );
}

export default MetricCard;
