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
  onSelect?: () => void
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

const NetworkIcon = (
  <svg aria-hidden="true" className="sidebar__navIcon" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="M12 3v6m0 6v6m9-9h-6m-6 0H3m14.95-4.95-4.24 4.24m-5.42 5.42-4.24 4.24m0-18.82 4.24 4.24m5.42 5.42 4.24 4.24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

const DropletIcon = (
  <svg aria-hidden="true" className="sidebar__navIcon" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="M12 3c-4 5-6 8-6 11a6 6 0 1 0 12 0c0-3-2-6-6-11Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

const AlertIcon = (
  <svg aria-hidden="true" className="sidebar__navIcon" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="m12 4 8 14H4l8-14Zm0 6v3m0 3v.01"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

const ClipboardIcon = (
  <svg aria-hidden="true" className="sidebar__navIcon" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="M9 4h6l1 2h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l1-2Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
    <path
      d="M9 13h6M9 17h4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

const ReportIcon = (
  <svg aria-hidden="true" className="sidebar__navIcon" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="M4 4h10l6 6v10H4V4Zm10 0v6h6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
    <path
      d="M8 14h4m-4 4h8"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

const GearIcon = (
  <svg aria-hidden="true" className="sidebar__navIcon" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="M12 3v2m0 14v2m7.07-12.07-1.41 1.41M6.34 17.66 4.93 19.07M21 12h-2M5 12H3m14.66 5.66-1.41-1.41M7.76 7.76 6.34 6.34"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

const SubItemIcon = <span aria-hidden="true" className="sidebar__navBullet" />

export default function SidebarLayout({ adminHref, children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [openDropdowns, setOpenDropdowns] = React.useState<Record<string, boolean>>({})
  const toggleLabel = isCollapsed ? 'Expand navigation' : 'Collapse navigation'

  const navItems = React.useMemo<NavItem[]>(
    () => [
      { id: 'dashboard', label: 'Dashboard', type: 'link', href: '#dashboard', icon: PulseIcon },
      {
        id: 'attack-surface',
        label: 'Attack Surface',
        type: 'dropdown',
        icon: TestTubeIcon,
        items: [
          { id: 'asset-exposure', label: 'Asset Exposure', icon: SubItemIcon },
          { id: 'asset-inventory', label: 'Asset Inventory', icon: SubItemIcon },
          { id: 'web-application', label: 'Web Application', icon: SubItemIcon },
          { id: 'screenshot', label: 'Screenshot', icon: SubItemIcon },
          { id: 'attack-surface-graph', label: 'Attack Surface Graph', icon: SubItemIcon },
        ],
      },
      {
        id: 'attack-surface-reduction',
        label: 'Attack Surface Reduction',
        type: 'link',
        href: '#attack-surface-reduction',
        icon: SparkleIcon,
      },
      {
        id: 'external-supply-chain',
        label: 'External Supply Chain',
        type: 'dropdown',
        icon: NetworkIcon,
        items: [
          { id: 'third-party-assets', label: 'Third Party Assets', icon: SubItemIcon },
          { id: 'technologies-with-cves', label: 'Technologies with CVEs', icon: SubItemIcon },
          { id: 'all-technologies', label: 'All Technologies', icon: SubItemIcon },
        ],
      },
      {
        id: 'data-leaks',
        label: 'Data Leaks',
        type: 'dropdown',
        icon: DropletIcon,
        items: [
          { id: 'all-data-leaks', label: 'All Data Leaks', icon: SubItemIcon },
          { id: 'data-leaks-tabular-view', label: 'Tabular View', icon: SubItemIcon },
        ],
      },
      {
        id: 'security-risks',
        label: 'Security Risks',
        type: 'dropdown',
        icon: AlertIcon,
        items: [
          { id: 'all-security-risks', label: 'All Security Risks', icon: SubItemIcon },
          { id: 'security-risks-tabular-view', label: 'Tabular View', icon: SubItemIcon },
          { id: 'detailed-view', label: 'Detailed View', icon: SubItemIcon },
          { id: 'risk-scoring', label: 'Risk Scoring', icon: SubItemIcon },
        ],
      },
      { id: 'issue-tracker', label: 'Issue Tracker', type: 'link', href: '#issue-tracker', icon: ClipboardIcon },
      {
        id: 'reports',
        label: 'Reports',
        type: 'dropdown',
        icon: ReportIcon,
        items: [
          { id: 'reports-overview', label: 'Reports', icon: SubItemIcon },
          { id: 'weekly-summary', label: 'Weekly Summary', icon: SubItemIcon },
        ],
      },
      {
        id: 'settings',
        label: 'Settings',
        type: 'dropdown',
        icon: GearIcon,
        items: [
          { id: 'seed-information', label: 'Seed Information', icon: SubItemIcon },
          { id: 'scanner-ip-addresses', label: 'Scanner IP Addresses', icon: SubItemIcon },
          { id: 'saas-third-party-keywords', label: 'SaaS & Third-Party Keywords', icon: SubItemIcon },
          { id: 'muted-instances', label: 'Muted Instances', icon: SubItemIcon },
          { id: 'integrations-api', label: 'Integrations and API', icon: SubItemIcon },
          {
            id: 'profile-page',
            label: 'Profile Page',
            icon: SubItemIcon,
            onSelect: () => {
              window.location.assign(adminHref)
            },
          },
          { id: 'team-org', label: 'Team & Org', icon: SubItemIcon },
          { id: 'asset-grouping', label: 'Asset Grouping', icon: SubItemIcon },
          { id: 'notification-ticketing-rules', label: 'Notification & Ticketing Rules', icon: SubItemIcon },
          { id: 'billing-plans', label: 'Billing and Plans', icon: SubItemIcon },
        ],
      },
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
    if (isCollapsed) {
      setIsCollapsed(false)
      setOpenDropdowns({ [id]: true })
      return
    }

    setOpenDropdowns((prev) => {
      const nextIsOpen = !prev[id]
      if (nextIsOpen) {
        return { [id]: true }
      }
      return {}
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
                              onClick={() => {
                                setOpenDropdowns({})
                                subItem.onSelect?.()
                              }}
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

                if (item.type === 'link') {
                  return (
                    <li key={item.id}>
                      <a
                        aria-label={item.label}
                        className="sidebar__navButton"
                        data-tooltip={isCollapsed ? item.label : undefined}
                        href={item.href}
                        title={isCollapsed ? item.label : undefined}
                      >
                        {item.icon}
                        <span className="sidebar__navLabel">{item.label}</span>
                      </a>
                    </li>
                  )
                }

                return null
              })}
            </ul>
          </nav>
        </div>
      </aside>
      <main className="mainContent">{children}</main>
    </div>
  )
}
