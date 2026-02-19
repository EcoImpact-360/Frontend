export default function Container({ children, className = "" }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-6 w-full ${className}`}>{children}</div>;
}
