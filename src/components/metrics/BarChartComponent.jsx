import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function BarChartComponent({ data, dataKey, xAxisKey = 'name', title }) {
  return (
    <section className="surface-card chart-card">
      {title && <h3 className="chart-card__title">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
          <Bar dataKey={dataKey} fill="#1976D2" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

export default BarChartComponent;
