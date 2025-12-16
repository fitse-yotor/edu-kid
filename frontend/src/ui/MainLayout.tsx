import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './layout.css'

type MainLayoutProps = {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const mainClass =
    location.pathname === '/'
      ? 'main-content-full'
      : location.pathname.startsWith('/projects') || location.pathname.startsWith('/learn')
        ? 'main-content main-content-full'
        : 'main-content'

  return (
    <div className="app-root">
      <header className="top-bar">
        <div className="top-bar-left">
          <div className="logo-circle">E</div>
          <div className="top-bar-text">
            <span className="app-name">Edu Kid Lab</span>
            <span className="app-motto">Let us build the future Ethiopia</span>
          </div>
        </div>
        <nav className="nav-tabs">
          <Link
            to="/"
            className={isActive('/') ? 'nav-tab nav-tab-active' : 'nav-tab'}
          >
            Projects
          </Link>
          <Link
            to="/learn"
            className={isActive('/learn') ? 'nav-tab nav-tab-active' : 'nav-tab'}
          >
            Learn Electronics
          </Link>
        </nav>
        <div className="top-bar-right">
          <div className="user-chip">Student</div>
        </div>
      </header>
      <main className={mainClass}>{children}</main>
    </div>
  )
}


