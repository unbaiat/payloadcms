import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import LoginForm from '../LoginForm'
import SidebarLayout from '../SidebarLayout'
import '../styles.css'
import SeedInformationContent, { DomainEntry } from './SeedInformationContent'

export default async function SeedInformationPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

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

  let initialDomains: DomainEntry[] = []

  try {
    const result = await payload.find({
      collection: 'domains',
      depth: 0,
      limit: 250,
      sort: '-createdAt',
    })

    initialDomains = result.docs
      .map((doc) => ({
        id: String(doc.id),
        name: typeof doc.name === 'string' ? doc.name : '',
        status: typeof doc.status === 'string' ? doc.status : 'pending',
      }))
      .filter((domain) => domain.name)
  } catch (error) {
    console.error('Failed to load domains', error)
  }

  return (
    <SidebarLayout adminHref={adminHref}>
      <SeedInformationContent initialDomains={initialDomains} />
    </SidebarLayout>
  )
}
