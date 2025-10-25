import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function DELETE(request: Request, context: any) {
  const { params } = context as { params: { id: string } }
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    await payload.delete({ collection: 'domains', id: params.id, req: { user } })

    return new Response(null, { status: 204 })
  } catch (error: unknown) {
    console.error(`Failed to delete domain ${params.id}`, error)
    return new Response('Failed to delete domain', { status: 500 })
  }
}
