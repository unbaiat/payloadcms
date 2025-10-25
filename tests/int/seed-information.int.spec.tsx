import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import SeedInformationContent from '@/app/(frontend)/seed-information/SeedInformationContent'

const SAMPLE_DOMAINS = [
  { id: 'domain-1', name: 'alpha.com', status: 'pending' },
  { id: 'domain-2', name: 'beta.net', status: 'pending' },
  { id: 'domain-3', name: 'gamma.io', status: 'pending' },
]

describe('SeedInformationContent', () => {
  const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
  const fetchMock = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>()

  beforeAll(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  beforeEach(() => {
    infoSpy.mockClear()
    fetchMock.mockReset()
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
  })

  afterEach(() => {
    cleanup()
  })

  afterAll(() => {
    infoSpy.mockRestore()
    vi.unstubAllGlobals()
  })

  it('filters domains based on search input and triggers verification', () => {
    render(<SeedInformationContent initialDomains={SAMPLE_DOMAINS} />)

    const searchInput = screen.getByPlaceholderText('Search by domain')
    fireEvent.change(searchInput, { target: { value: 'beta' } })

    expect(screen.queryByText('alpha.com')).not.toBeInTheDocument()
    expect(screen.getByText('beta.net')).toBeInTheDocument()

    const verifyButton = screen.getByRole('button', { name: 'Verify' })
    fireEvent.click(verifyButton)

    expect(infoSpy).toHaveBeenCalledWith('Verification queued for beta.net')
  })

  it('supports bulk delete and validate by support action', async () => {
    render(<SeedInformationContent initialDomains={SAMPLE_DOMAINS} />)

    const selectAll = screen.getAllByLabelText('Select all domains')[0]
    fireEvent.click(selectAll)

    const deleteSelectedButtons = screen.getAllByRole('button', { name: 'Delete Selected Domains' })
    await waitFor(() => {
      expect(deleteSelectedButtons[0]).not.toBeDisabled()
    })
    fireEvent.click(deleteSelectedButtons[0])

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(SAMPLE_DOMAINS.length)
    })

    await waitFor(() => {
      expect(screen.getByText('No domains match this filter.')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(infoSpy).toHaveBeenCalledWith('Selected domains deleted')
    })

    const validateButton = screen.getAllByRole('button', { name: 'Validate by Support' })[0]
    fireEvent.click(validateButton)
    expect(validateButton).toBeDisabled()
    expect(infoSpy).toHaveBeenCalledWith('Support validation requested')

    await waitFor(() => {
      expect(validateButton).not.toBeDisabled()
    })

    expect(infoSpy).toHaveBeenCalledWith('Support validation completed')
  })
})
