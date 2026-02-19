export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-card border border-black/5 p-4 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
