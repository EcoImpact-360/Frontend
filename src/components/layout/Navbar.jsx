import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Container from "./Container";

const navLinkBase =
  "inline-flex items-center gap-2 px-1 py-2 text-sm transition border-b-2";

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${navLinkBase} ${
          isActive
            ? "border-black text-black font-medium"
            : "border-transparent text-black/70 hover:text-black"
        }`
      }
    >
      <span>{label}</span>
      {to === "/alerts" && <span className="text-xs text-black/50">(nuevo)</span>}
    </NavLink>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-black/10">
      <Container className="flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <span className="font-semibold tracking-tight text-black">EcoImpact 360</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavItem to="/" label="Inicio" />
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/alerts" label="Alerts" />
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-accent transition"
          >
            Registrar
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-black/10"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
        >
          <span className="text-lg">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </Container>

      {menuOpen && (
        <div className="md:hidden border-t border-black/10 bg-white/95">
          <Container className="py-3 flex flex-col gap-2">
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-black/80 hover:bg-black/5"
            >
              Inicio
            </NavLink>
            <NavLink
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-black/80 hover:bg-black/5"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/alerts"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-black/80 hover:bg-black/5"
            >
              Alerts
            </NavLink>
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="mt-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium text-center"
            >
              Registrar
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
