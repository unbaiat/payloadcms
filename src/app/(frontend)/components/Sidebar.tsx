import type { ReactNode } from 'react'
import Link from 'next/link'

import { logout } from '../actions'

type SidebarProps = {
  activePath: string
  userEmail?: string | null
}

type NavigationLink = {
  children?: NavigationLink[]
  href?: string
  icon?: string
  label: string
}

type NavigationAction = {
  label: string
  type: 'action'
}

type NavigationItem = NavigationLink | NavigationAction

type NavSection = {
  icon: string
  items: NavigationItem[]
  title: string
}

const NAVIGATION: NavSection[] = [
  {
    icon: 'workspace',
    title: 'Workspace',
    items: [
      { label: 'Home', href: '/', icon: '⌂' },
      {
        label: 'Experiments',
        icon: '🧪',
        children: [{ label: 'Test', href: '/test' }],
      },
    ],
  },
  {
    icon: 'user',
    title: 'Account',
    items: [{ label: 'Logout', type: 'action' }],
  },
]

const normalizePath = (value: string) => {
  if (!value) return '/'
  const trimmed = value.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

const isAction = (item: NavigationItem): item is NavigationAction =>
  'type' in item && item.type === 'action'

const isLinkActive = (item: NavigationLink, path: string): boolean => {
  if (item.href && normalizePath(item.href) === path) {
    return true
  }

  return item.children?.some((child) => isLinkActive(child, path)) ?? false
}

export function Sidebar({ activePath, userEmail }: SidebarProps) {
  const normalizedActivePath = normalizePath(activePath)

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
              <span className="sidebar__email" title={userEmail}>
                {userEmail}
              </span>
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
              {renderItems(section.items, normalizedActivePath)}
            </ul>
          </details>
        ))}
      </nav>
    </aside>
  )
}

const renderItems = (items: NavigationItem[], activePath: string, depth = 0): ReactNode[] =>
  items.map((item) => {
    if (isAction(item)) {
      return (
        <li key={`action-${item.label}`}>
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
    }

    const hasChildren = Boolean(item.children?.length)
    const itemIsActive = isLinkActive(item, activePath)
    const itemKey = item.href ?? item.label

    if (hasChildren) {
      return (
        <li key={`group-${itemKey}`} className="sidebar__group">
          <details
            className="sidebar__subsection"
            open={itemIsActive}
            aria-expanded={itemIsActive ? 'true' : 'false'}
          >
            <summary
              className="sidebar__subheader"
              data-active={itemIsActive ? 'true' : undefined}
            >
              <span className="sidebar__subheaderLabel">
                {item.icon && (
                  <span className="sidebar__subheaderIcon" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </span>
              <span className="sidebar__caret" aria-hidden="true" />
            </summary>
            <ul className="sidebar__sublist" data-depth={depth + 1}>
              {renderItems(item.children ?? [], activePath, depth + 1)}
            </ul>
          </details>
        </li>
      )
    }

    if (!item.href) {
      return (
        <li key={`text-${itemKey}`}>
          <span className="sidebar__static" data-depth={depth}>
            {item.label}
          </span>
        </li>
      )
    }

    const isCurrent = normalizePath(item.href) === activePath

    return (
      <li key={item.href}>
        <Link
          href={item.href}
          className="sidebar__link"
          data-active={isCurrent ? 'true' : undefined}
          data-depth={depth}
          aria-current={isCurrent ? 'page' : undefined}
        >
          <span className="sidebar__linkLabel">
            {item.icon && (
              <span className="sidebar__linkBullet" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </span>
          <span className="sidebar__linkIcon" aria-hidden="true">
            →
          </span>
        </Link>
      </li>
    )
  })
