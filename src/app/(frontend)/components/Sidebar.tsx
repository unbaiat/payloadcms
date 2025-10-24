import Link from 'next/link'

import { logout } from '../actions'

type SidebarProps = {
  activePath: string
  userEmail?: string | null
}

type NavItem =
  | {
      href: string
      label: string
      type: 'link'
    }
  | {
      label: string
      type: 'action'
    }

type NavSection = {
  icon: string
  items: NavItem[]
  title: string
}

const NAVIGATION: NavSection[] = [
  {
    icon: 'workspace',
    title: 'Workspace',
    items: [
      { type: 'link', label: 'Home', href: '/' },
      { type: 'link', label: 'Test', href: '/test' },
    ],
  },
  {
    icon: 'user',
    title: 'Account',
    items: [{ type: 'action', label: 'Logout' }],
  },
]

export function Sidebar({ activePath, userEmail }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <span className="sidebar__brandGlow" />
          <span className="sidebar__brandName">CY Workspace</span>
        </div>
        {userEmail && (
          <div className="sidebar__profile">
            <span className="sidebar__avatar" aria-hidden="true">
              {userEmail.slice(0, 2).toUpperCase()}
            </span>
            <div className="sidebar__identity">
              <span className="sidebar__hello">Welcome back</span>
              <span className="sidebar__email">{userEmail}</span>
            </div>
          </div>
        )}
      </div>

      <nav className="sidebar__nav">
        {NAVIGATION.map((section) => (
          <details className="sidebar__section" key={section.title} open>
            <summary className="sidebar__sectionHeader">
              <span className="sidebar__sectionIcon" aria-hidden="true">
                {section.icon === 'workspace' ? '⎔' : '◉'}
              </span>
              <span>{section.title}</span>
            </summary>
            <ul className="sidebar__list">
              {section.items.map((item) => {
                if (item.type === 'link') {
                  const isActive = activePath === item.href

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="sidebar__link"
                        data-active={isActive ? 'true' : undefined}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span>{item.label}</span>
                        <span className="sidebar__linkIcon" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </li>
                  )
                }

                return (
                  <li key={item.label}>
                    <form action={logout} className="sidebar__form">
                      <button type="submit" className="sidebar__button">
                        <span>{item.label}</span>
                        <span className="sidebar__linkIcon" aria-hidden="true">
                          ↘
                        </span>
                      </button>
                    </form>
                  </li>
                )
              })}
            </ul>
          </details>
        ))}
      </nav>
    </aside>
  )
}
