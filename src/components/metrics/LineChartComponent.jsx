import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function LineChartComponent({ data, dataKey, xAxisKey = 'name', title }) {
  if (!data || data.length === 0) {
    return <div className="alerts-state">No hay datos historicos disponibles</div>;
  }

  return (
    <section className="surface-card chart-card">
      {title && <h3 className="chart-card__title">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d9e2ee" />
          <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: '#4e616f', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4e616f', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: '10px',
              border: '1px solid #c9d6e6',
              boxShadow: '0 10px 24px rgba(38,50,56,0.12)',
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#2E7D32"
            strokeWidth={3}
            dot={{ r: 4, fill: '#2E7D32', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}

export default LineChartComponent;
