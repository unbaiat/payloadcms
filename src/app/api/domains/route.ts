import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(request: Request) {
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
    if (error instanceof Error && 'errors' in error) {
      const firstError = (error as { errors: { message?: string }[] }).errors[0]
      return new Response(firstError?.message ?? 'Failed to create domain', { status: 400 })
    }
    return new Response('Failed to create domain', { status: 500 })
  }
}
