import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'

import { Sidebar } from '../components/Sidebar'
import '../styles.css'

export default async function TestPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/')
  }

  return (
    <div className="app-shell">
      <Sidebar activePath="/test" userEmail={user.email} />
      <div className="test-page">
        <div className="test-page__card">
          <span className="test-page__badge">Diagnostics</span>
          <p>Its working.</p>
        </div>
      </div>
    </div>
  )
}
