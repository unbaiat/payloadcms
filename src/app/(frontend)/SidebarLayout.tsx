'use client'

import React from 'react'

type SidebarLayoutProps = {
  adminHref: string
  children: React.ReactNode
}

type NavDropdownItem = {
  id: string
  label: string
  icon: React.ReactNode
}

type NavItem =
  | {
      id: string
      label: string
      type: 'dropdown'
      items: NavDropdownItem[]
      icon: React.ReactNode
    }
  | {
      id: string
      label: string
      type: 'link'
      href: string
      icon: React.ReactNode
    }

const TestTubeIcon = (
  <svg aria-hidden="true" className="sidebar__navIcon" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="M15 3v2.5a6 6 0 0 1-2.536 4.928L11 11v2l5.293 5.293a1 1 0 0 1 0 1.414l-.586.586a3 3 0 0 1-4.243 0l-6.464-6.465a3 3 0 0 1 0-4.242L9 6.293V3"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

const PulseIcon = (
  <svg aria-hidden="true" className="sidebar__navIcon" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="M3 12h3l2 7 4-14 3 7h6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

const SparkleIcon = (
  <svg aria-hidden="true" className="sidebar__navIcon" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="M12 3v2m6.364.636-1.414 1.414M21 12h-2m-1.636 6.364-1.414-1.414M12 21v-2m-6.364-.636 1.414-1.414M3 12h2m1.636-6.364 1.414 1.414M9 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

const ShieldIcon = (
  <svg aria-hidden="true" className="sidebar__navIcon" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="M12 21c-4.2-1.8-7-4.5-7-9V5l7-3 7 3v7c0 4.5-2.8 7.2-7 9Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

export default function SidebarLayout({ adminHref, children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [openDropdowns, setOpenDropdowns] = React.useState<Record<string, boolean>>({})
  const toggleLabel = isCollapsed ? 'Expand navigation' : 'Collapse navigation'

  const navItems = React.useMemo<NavItem[]>(
    () => [
      {
        id: 'test1',
        label: 'Test 1',
        type: 'dropdown',
        icon: TestTubeIcon,
        items: [
          { id: 'test1-overview', label: 'Overview', icon: PulseIcon },
          { id: 'test1-analytics', label: 'Analytics', icon: SparkleIcon },
        ],
      },
      {
        id: 'test2',
        label: 'Test 2',
        type: 'dropdown',
        icon: PulseIcon,
        items: [
          { id: 'test2-reports', label: 'Reports', icon: SparkleIcon },
          { id: 'test2-insights', label: 'Insights', icon: PulseIcon },
        ],
      },
      { id: 'admin', label: 'Admin', type: 'link', href: adminHref, icon: ShieldIcon },
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
                          data-tooltip={isCollapsed ? item.label : undefined}
                          title={isCollapsed ? item.label : undefined}
                        >
                          {item.icon}
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
                                {subItem.icon}
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
                    <span className="sidebar__navLabel">{item.label}</span>
                  </>
                )

                return (
                  <li key={item.id}>
                    {item.type === 'link' ? (
                      <a
                        aria-label={item.label}
                        className="sidebar__navButton"
                        data-tooltip={isCollapsed ? item.label : undefined}
                        href={item.href}
                        title={isCollapsed ? item.label : undefined}
                      >
                        {item.icon}
                        {content}
                      </a>
                    ) : (
                      <button
                        aria-label={item.label}
                        className="sidebar__navButton"
                        data-tooltip={isCollapsed ? item.label : undefined}
                        type="button"
                        title={isCollapsed ? item.label : undefined}
                      >
                        {item.icon}
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
