import Link from 'next/link'

import { logout } from '../actions'

type SidebarProps = {
  userEmail?: string | null
}

export function Sidebar({ userEmail }: SidebarProps) {
  return (
    <aside className="sidebar">
      {userEmail && <p className="sidebar__greeting">Signed in as {userEmail}</p>}
      <nav className="sidebar__nav">
        <Link href="/">Home</Link>
        <Link href="/test">Test</Link>
        <form action={logout}>
          <button type="submit">Logout</button>
        </form>
      </nav>
    </aside>
  )
}
