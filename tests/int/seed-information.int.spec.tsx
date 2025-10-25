import { cleanup, render, screen, fireEvent, waitFor, within } from '@testing-library/react'
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

  it('opens the dialog and adds a new domain', async () => {
    render(<SeedInformationContent initialDomains={[]} />)

    const addDomainButton = screen.getByRole('button', { name: '+ Add Domain' })
    fireEvent.click(addDomainButton)

    const dialog = await screen.findByRole('dialog', { name: 'Add Domain' })
    const nameField = screen.getByLabelText('Domain')
    const submitButton = within(dialog).getByRole('button', { name: 'Add Domain' })

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'domain-42', name: 'delta.com', status: 'pending' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    fireEvent.change(nameField, { target: { value: 'delta.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/domains',
        expect.objectContaining({
          method: 'POST',
        }),
      )
    })

    await waitFor(() => {
      expect(screen.getByText('delta.com')).toBeInTheDocument()
    })

    expect(infoSpy).toHaveBeenCalledWith('Domain added: delta.com')
  })

  it('switches between domain and asset views', async () => {
    render(<SeedInformationContent initialDomains={SAMPLE_DOMAINS} />)

    const assetTab = screen.getByRole('tab', { name: 'Asset' })
    fireEvent.click(assetTab)

    expect(screen.queryByRole('button', { name: '+ Add Domain' })).not.toBeInTheDocument()
    expect(screen.getByText('Asset management')).toBeInTheDocument()

    const domainTab = screen.getByRole('tab', { name: 'Domain' })
    fireEvent.click(domainTab)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '+ Add Domain' })).toBeInTheDocument()
    })
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
