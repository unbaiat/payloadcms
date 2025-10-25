import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import SeedInformationContent from '@/app/(frontend)/seed-information/SeedInformationContent'

const SAMPLE_DOMAINS = [
  { id: 'domain-1', name: 'alpha.com' },
  { id: 'domain-2', name: 'beta.net' },
  { id: 'domain-3', name: 'gamma.io' },
]

describe('SeedInformationContent', () => {
  const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

  beforeEach(() => {
    infoSpy.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
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
    fireEvent.click(deleteSelectedButtons[0])
    expect(screen.getByText('No domains match this filter.')).toBeInTheDocument()
    expect(infoSpy).toHaveBeenCalledWith('Selected domains deleted')

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
