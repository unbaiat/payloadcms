'use client'

import React from 'react'

type SidebarLayoutProps = {
  adminHref: string
  children: React.ReactNode
}

type NavDropdownItem = {
  id: string
  label: string
}

type NavItem =
  | {
      id: string
      label: string
      abbreviation: string
      type: 'dropdown'
      items: NavDropdownItem[]
    }
  | { id: string; label: string; abbreviation: string; type: 'link'; href: string }

export default function SidebarLayout({ adminHref, children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [openDropdowns, setOpenDropdowns] = React.useState<Record<string, boolean>>({})
  const toggleLabel = isCollapsed ? 'Expand navigation' : 'Collapse navigation'

  const navItems = React.useMemo<NavItem[]>(
    () => [
      {
        id: 'test1',
        label: 'Test 1',
        abbreviation: 'T1',
        type: 'dropdown',
        items: [
          { id: 'test1-overview', label: 'Overview' },
          { id: 'test1-analytics', label: 'Analytics' },
        ],
      },
      {
        id: 'test2',
        label: 'Test 2',
        abbreviation: 'T2',
        type: 'dropdown',
        items: [
          { id: 'test2-reports', label: 'Reports' },
          { id: 'test2-insights', label: 'Insights' },
        ],
      },
      { id: 'admin', label: 'Admin', abbreviation: 'AD', type: 'link', href: adminHref },
    ],
    [adminHref],
  )

  React.useEffect(() => {
    if (window.innerWidth < 960) {
      setIsCollapsed(true)
    }
  }, [])

  React.useEffect(() => {
    if (isCollapsed) {
      setOpenDropdowns({})
    }
  }, [isCollapsed])

  const handleDropdownToggle = (id: string) => {
    setOpenDropdowns((prev) => {
      const nextIsOpen = !prev[id]
      const nextState: Record<string, boolean> = {}

      if (nextIsOpen) {
        nextState[id] = true
      }

      return nextState
    })
  }

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
            <span aria-hidden="true" className="sidebar__toggleIcon" data-collapsed={isCollapsed}>
              <span className="sidebar__toggleBar" />
              <span className="sidebar__toggleBar" />
              <span className="sidebar__toggleBar" />
            </span>
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
                if (item.type === 'dropdown') {
                  const isOpen = Boolean(openDropdowns[item.id])
                  const listId = `sidebar-dropdown-${item.id}`

                  return (
                    <li key={item.id}>
                      <div
                        className="sidebar__navDropdown"
                        data-state={isOpen ? 'open' : 'closed'}
                      >
                        <button
                          aria-controls={listId}
                          aria-expanded={isOpen}
                          className="sidebar__navButton"
                          onClick={() => handleDropdownToggle(item.id)}
                          type="button"
                        >
                          <span aria-hidden="true" className="sidebar__navAbbrev">
                            {item.abbreviation}
                          </span>
                          <span className="sidebar__navLabel">{item.label}</span>
                          <span aria-hidden="true" className="sidebar__dropdownCaret" />
                        </button>
                        <ul
                          aria-hidden={!isOpen}
                          className="sidebar__dropdownList"
                          id={listId}
                          hidden={!isOpen}
                          role="menu"
                        >
                          {item.items.map((subItem) => (
                            <li key={subItem.id} role="none">
                              <button
                                className="sidebar__dropdownItem"
                                onClick={() => setOpenDropdowns({})}
                                role="menuitem"
                                type="button"
                              >
                                {subItem.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  )
                }

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
