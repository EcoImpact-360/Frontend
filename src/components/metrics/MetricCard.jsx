import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

function MetricCard({ title, value, type = 'number', unit, icon, trend }) {
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

  const trendClass = trend >= 0 ? 'metric-card__trend metric-card__trend--up' : 'metric-card__trend metric-card__trend--down';
  const displayValue = unit ? `${formatValue()} ${unit}` : formatValue();

  return (
    <article className="surface-card metric-card">
      <p className="metric-card__label">{title}</p>
      <div className="metric-card__row">
        <h3 className="metric-card__value">
          {displayValue}
        </h3>
        {icon && <span className="metric-card__icon">{icon}</span>}
      </div>
      {trend !== undefined && <p className={trendClass}>{trend >= 0 ? 'UP' : 'DOWN'} {Math.abs(trend)}%</p>}
    </article>
  );
}

export default MetricCard;
