import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import { Sidebar } from './components/Sidebar'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  const content = (
    <div className="home">
      <section className="home__card">
        <div className="home__badge">CY Platform</div>
        <picture className="home__logo">
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        <h1>{!user ? 'Welcome to CY' : `Welcome back, ${user.email}`}</h1>
        <p className="home__subtitle">
          Launch projects faster with an opinionated starter that is ready for modern content
          operations.
        </p>
        <div className="home__actions">
          <a
            className="home__action home__action--primary"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin
          </a>
          <a
            className="home__action home__action--ghost"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Browse docs
          </a>
        </div>
        <footer className="home__footer">
          <p>Personalize this experience from the source</p>
          <a className="home__codeLink" href={fileURL}>
            <code>app/(frontend)/page.tsx</code>
          </a>
        </footer>
      </section>
    </div>
  )

  if (!user) {
    return content
  }

  return (
    <div className="app-shell">
      <Sidebar activePath="/" userEmail={user.email} />
      {content}
    </div>
  )
}
