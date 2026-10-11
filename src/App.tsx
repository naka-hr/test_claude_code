import { useState, useSyncExternalStore } from 'react'
import Chat from './Chat'
import Top from './Top'
import './App.css'

function subscribeHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function getHash() {
  return window.location.hash
}

function App() {
  const [showStars, setShowStars] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const hash = useSyncExternalStore(subscribeHash, getHash)
  const isChat = hash === '#chat'

  return (
    <>
      {showStars && (
        <div className="stars" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      <div className="layout">
        <nav className="menu" aria-label="メインメニュー">
          <button
            type="button"
            className="menu-toggle"
            aria-label="メニュー"
            aria-expanded={menuOpen}
            aria-controls="menu-list"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul id="menu-list" className={menuOpen ? 'open' : undefined}>
            <li>
              <a
                href="#chat"
                aria-current={isChat ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                メニュー1
              </a>
            </li>
            <li>
              <a href="#" onClick={() => setMenuOpen(false)}>
                メニュー2
              </a>
            </li>
            <li>
              <a href="#" onClick={() => setMenuOpen(false)}>
                メニュー3
              </a>
            </li>
            <li>
              <button
                type="button"
                className="stars-toggle"
                aria-pressed={showStars}
                onClick={() => setShowStars((show) => !show)}
              >
                流れ星 {showStars ? 'ON' : 'OFF'}
              </button>
            </li>
          </ul>
        </nav>

        <main className="content">{isChat ? <Chat /> : <Top />}</main>
      </div>
    </>
  )
}

export default App
