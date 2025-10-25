import configPromise from '@payload-config'
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'

type Params = {
  id: string
}

export async function DELETE(request: NextRequest, context: { params: Params }) {
  const { params } = context
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    await payload.delete({
      collection: 'domains',
      id: params.id,
      req: { user },
    })

    return new Response(null, { status: 204 })
  } catch (error: unknown) {
    console.error(`Failed to delete domain ${params.id}`, error)
    return new Response('Failed to delete domain', { status: 500 })
  }
}
