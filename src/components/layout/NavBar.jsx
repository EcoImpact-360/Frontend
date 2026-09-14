import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const PAGE_LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/alerts', label: 'Alertas' },
  { to: '/register', label: 'Registrar Residuo' },
];
function NavBar() {
  const { isAuthenticated, school, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const linkClass = ({ isActive }) => `app-nav__link${isActive ? ' app-nav__link--active' : ''}`;
  return (
    <nav className="app-nav">
      <div className="app-nav__inner">
        <NavLink to="/" end className="app-nav__brand">
          EcoImpact 360
        </NavLink>
        <div className="app-nav__links">
          {PAGE_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="app-nav__links app-nav__links--account">
          {isAuthenticated ? (
            <>
              <NavLink to="/register-school" className={linkClass}>
                Añadir Aula
              </NavLink>
              <span className="app-nav__link" aria-label="Colegio conectado">
                {school?.name}
              </span>
              <button type="button" className="app-nav__link app-nav__link--button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/register-school" className={linkClass}>
                Registrar Colegio
              </NavLink>
              <NavLink to="/login" className={linkClass}>
                Iniciar sesión
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
export default NavBar;
