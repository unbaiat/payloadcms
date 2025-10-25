import configPromise from '@payload-config'
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'

export const POST = async (request: NextRequest) => {
  const payload = await getPayload({ config: configPromise })

  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: { name?: string } = {}
  try {
    body = await request.json()
  } catch (error) {
    return new Response('Invalid JSON body', { status: 400 })
  }

  const domainName = body.name?.trim().toLowerCase()

  if (!domainName) {
    return new Response('Domain name is required', { status: 400 })
  }

  try {
    const created = await payload.create({
      collection: 'domains',
      data: {
        name: domainName,
        status: 'pending',
      },
      req: { user },
    })

    const responseBody = {
      id: created.id,
      name: created.name,
      status: created.status ?? 'pending',
    }

    return Response.json(responseBody, { status: 201 })
  } catch (error: unknown) {
    console.error('Failed to create domain', error)
    return new Response('Failed to create domain', { status: 500 })
  }
}
