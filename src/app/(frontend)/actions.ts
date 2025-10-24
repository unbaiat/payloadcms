'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout() {
  const cookieStore = cookies()

  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.startsWith('payload-')) {
      cookieStore.delete(cookie.name)
    }
  }

  redirect('/')
}
