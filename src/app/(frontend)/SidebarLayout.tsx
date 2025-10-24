'use client'

import React from 'react'

type SidebarLayoutProps = {
  adminHref: string
  children: React.ReactNode
}

type NavItem =
  | { id: string; label: string; abbreviation: string; type: 'button' }
  | { id: string; label: string; abbreviation: string; type: 'link'; href: string }

export default function SidebarLayout({ adminHref, children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const toggleLabel = isCollapsed ? 'Expand navigation' : 'Collapse navigation'

  const navItems = React.useMemo<NavItem[]>(
    () => [
      { id: 'test1', label: 'Test 1', abbreviation: 'T1', type: 'button' },
      { id: 'test2', label: 'Test 2', abbreviation: 'T2', type: 'button' },
      { id: 'admin', label: 'Admin', abbreviation: 'AD', type: 'link', href: adminHref },
    ],
    [adminHref],
  )

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
              {navItems.map((item) => {
                const content = (
                  <>
                    <span aria-hidden="true" className="sidebar__navAbbrev">
                      {item.abbreviation}
                    </span>
                    <span className="sidebar__navLabel">{item.label}</span>
                  </>
                )

                return (
                  <li key={item.id}>
                    {item.type === 'link' ? (
                      <a
                        aria-label={item.label}
                        className="sidebar__navButton"
                        href={item.href}
                      >
                        {content}
                      </a>
                    ) : (
                      <button
                        aria-label={item.label}
                        className="sidebar__navButton"
                        type="button"
                      >
                        {content}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>
      <main className="mainContent">{children}</main>
    </div>
  )
}
