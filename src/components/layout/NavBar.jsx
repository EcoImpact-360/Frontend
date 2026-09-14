import { NavLink } from 'react-router-dom';
const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/alerts', label: 'Alertas' },
  { to: '/register', label: 'Registrar Residuo' },
  { to: '/register-school', label: 'Registrar Colegio' },
];
function NavBar() {
  return (
    <nav className="app-nav">
      <div className="app-nav__inner">
        <NavLink to="/" end className="app-nav__brand">
          EcoImpact 360
        </NavLink>
        <div className="app-nav__links">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `app-nav__link${isActive ? ' app-nav__link--active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
export default NavBar;
