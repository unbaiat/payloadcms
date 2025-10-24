'use client'

import React from 'react'

type SidebarLayoutProps = {
  children: React.ReactNode
}

const NAV_ITEMS = [
  { id: 'test1', label: 'Test 1', abbreviation: 'T1' },
  { id: 'test2', label: 'Test 2', abbreviation: 'T2' },
] as const

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const toggleLabel = isCollapsed ? 'Expand navigation' : 'Collapse navigation'

  React.useEffect(() => {
    if (window.innerWidth < 960) {
      setIsCollapsed(true)
    }
  }, [])

  return (
    <div className="appLayout" data-collapsed={isCollapsed}>
      <aside className="sidebar">
        <div className="sidebar__inner">
          <button
            aria-controls="primary-navigation"
            aria-expanded={!isCollapsed}
            aria-label={toggleLabel}
            className="sidebar__toggle"
            onClick={() => setIsCollapsed((prev) => !prev)}
            type="button"
          >
            <span aria-hidden="true">{isCollapsed ? '>' : '<'}</span>
            <span className="sidebar__toggleLabel">{toggleLabel}</span>
          </button>
          <div className="sidebar__brand">
            <span className="sidebar__brandMark" aria-hidden="true">
              CY
            </span>
            <span className="sidebar__brandText">Control Center</span>
          </div>
          <nav aria-label="Primary" className="sidebar__nav" id="primary-navigation">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    aria-label={item.label}
                    className="sidebar__navButton"
                    type="button"
                  >
                    <span aria-hidden="true" className="sidebar__navAbbrev">
                      {item.abbreviation}
                    </span>
                    <span className="sidebar__navLabel">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
      <main className="mainContent">{children}</main>
    </div>
  )
}
