import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/alerts', label: 'Alertas' },
  { to: '/register', label: 'Registrar Residuo' },
  { to: '/register-school', label: 'Registrar Colegio' },
];
function NavBar() {
  const { isAuthenticated, school, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
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
          {isAuthenticated ? (
            <>
              <span className="app-nav__link" aria-label="Colegio conectado">
                {school?.name}
              </span>
              <button type="button" className="app-nav__link app-nav__link--button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => `app-nav__link${isActive ? ' app-nav__link--active' : ''}`}
            >
              Iniciar sesión
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
export default NavBar;
