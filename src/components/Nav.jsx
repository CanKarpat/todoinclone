import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Nav() {
  const { signOut, profile } = useAuth()

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
      <div className="nav-right">
        {profile && (
          <span className="player-status">
            Lv {profile.player_level} · {profile.total_xp} XP · 🔥 {profile.daily_streak}
            {profile.unlocked_achievements?.length > 0 && (
              <> · 🏆 {profile.unlocked_achievements.length}</>
            )}
          </span>
        )}
        <button className="btn-ghost" onClick={signOut}>Çıkış yap</button>
      </div>
    </header>
  )
}
