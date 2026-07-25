import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Nav() {
  const { signOut } = useAuth()

  return (
    <header className="app-header">
      <nav className="app-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
          Görevler
        </NavLink>
        <NavLink to="/meetings" className={({ isActive }) => (isActive ? 'active' : '')}>
          Toplantılar
        </NavLink>
      </nav>
      <button className="btn-ghost" onClick={signOut}>Çıkış yap</button>
    </header>
  )
}
