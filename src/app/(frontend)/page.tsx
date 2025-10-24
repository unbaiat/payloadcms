import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import LoginForm from './LoginForm'
import SidebarLayout from './SidebarLayout'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  if (!user) {
    return (
      <div className="auth">
        <div className="authCard">
          <div className="authHeader">
            <picture aria-hidden="true">
              <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
              <Image
                alt=""
                height={56}
                src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
                width={56}
              />
            </picture>
            <h1>Welcome back</h1>
            <p>Please sign in to manage your content.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    )
  }

  const adminHref = payloadConfig.routes?.admin ?? '/admin'

  return (
    <SidebarLayout adminHref={adminHref}>
      <div className="home">
        <div className="content">
          <picture>
            <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
            <Image
              alt="Payload Logo"
              height={65}
              src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
              width={65}
            />
          </picture>
          <h1>Welcome back, {user.email}</h1>
          <div className="links">
            <a
              className="docs"
              href="https://payloadcms.com/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              Documentation
            </a>
          </div>
        </div>
        <div className="footer">
          <p>Update this page by editing</p>
          <a className="codeLink" href={fileURL}>
            <code>app/(frontend)/page.tsx</code>
          </a>
        </div>
      </div>
    </SidebarLayout>
  )
}
