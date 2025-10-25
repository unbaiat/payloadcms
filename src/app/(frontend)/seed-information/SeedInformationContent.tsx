'use client'

import React from 'react'

export type DomainEntry = {
  id: string
  name: string
  status: string
}

type SeedInformationContentProps = {
  initialDomains?: DomainEntry[]
}

export default function SeedInformationContent({
  initialDomains = [],
}: SeedInformationContentProps) {
  const [domains, setDomains] = React.useState<DomainEntry[]>(initialDomains)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => new Set())
  const [isSupportLoading, setIsSupportLoading] = React.useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isAddDialogSubmitting, setIsAddDialogSubmitting] = React.useState(false)
  const [newDomainName, setNewDomainName] = React.useState('')
  const [addDialogError, setAddDialogError] = React.useState<string | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false)
  const [rowDeletionId, setRowDeletionId] = React.useState<string | null>(null)
  const selectAllRef = React.useRef<HTMLInputElement>(null)
  const dialogInputRef = React.useRef<HTMLInputElement>(null)

  const filteredDomains = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return domains
    }

    const term = searchTerm.trim().toLowerCase()
    return domains.filter((domain) => domain.name.toLowerCase().includes(term))
  }, [domains, searchTerm])

  const areAllVisibleSelected =
    filteredDomains.length > 0 && filteredDomains.every((domain) => selectedIds.has(domain.id))

  const isAnyVisibleSelected = filteredDomains.some((domain) => selectedIds.has(domain.id))

  React.useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isAnyVisibleSelected && !areAllVisibleSelected
    }
  }, [areAllVisibleSelected, isAnyVisibleSelected])

  React.useEffect(() => {
    if (isAddDialogOpen && dialogInputRef.current) {
      dialogInputRef.current.focus()
    }
  }, [isAddDialogOpen])

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAllVisible = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      filteredDomains.forEach((domain) => {
        if (checked) {
          next.add(domain.id)
        } else {
          next.delete(domain.id)
        }
      })
      return next
    })
  }

  const handleDelete = async (id: string) => {
    setRowDeletionId(id)
    try {
      const response = await fetch(`/api/domains/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error(`Failed to delete domain ${id}`)
      }

      setDomains((prev) => prev.filter((domain) => domain.id !== id))
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      console.info(`Domain ${id} removed`)
    } catch (error) {
      console.error(`Failed to delete domain ${id}`, error)
    } finally {
      setRowDeletionId(null)
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) {
      return
    }

    const idsToDelete = Array.from(selectedIds)
    setIsBulkDeleting(true)
    try {
      await Promise.all(
        idsToDelete.map(async (id) => {
          const response = await fetch(`/api/domains/${id}`, { method: 'DELETE' })
          if (!response.ok) {
            throw new Error(`Failed to delete domain ${id}`)
          }
        }),
      )

      setDomains((prev) => prev.filter((domain) => !selectedIds.has(domain.id)))
      setSelectedIds(new Set())
      console.info('Selected domains deleted')
    } catch (error) {
      console.error('Failed to delete selected domains', error)
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const handleVerify = (domain: DomainEntry) => {
    console.info(`Verification queued for ${domain.name}`)
  }

  const handleValidateBySupport = async () => {
    setIsSupportLoading(true)
    console.info('Support validation requested')
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.info('Support validation completed')
    setIsSupportLoading(false)
  }

  const closeAddDialog = () => {
    if (isAddDialogSubmitting) {
      return
    }
    setIsAddDialogOpen(false)
    setNewDomainName('')
    setAddDialogError(null)
  }

  const handleAddDomain = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = newDomainName.trim().toLowerCase()

    if (!value) {
      setAddDialogError('Enter a domain name to continue.')
      return
    }

    setIsAddDialogSubmitting(true)

    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create domain (${response.status})`)
      }

      const created: DomainEntry = await response.json()

      setDomains((prev) => [
        {
          id: created.id,
          name: created.name,
          status: created.status ?? 'pending',
        },
        ...prev,
      ])

      setSelectedIds(new Set())
      setIsAddDialogOpen(false)
      setNewDomainName('')
      setAddDialogError(null)
      console.info(`Domain added: ${created.name}`)
    } catch (error) {
      console.error('Failed to add domain', error)
      setAddDialogError('Unable to add domain. Please try again.')
    } finally {
      setIsAddDialogSubmitting(false)
    }
  }

  const statusLabel = (status: string) => {
    if (status === 'verified') {
      return 'Verified'
    }
    return 'Pending Verification'
  }

  return (
    <>
      <section className="seedInfo">
        <header className="seedInfo__header">
          <div className="seedInfo__tabs" role="tablist" aria-label="Seed information navigation">
            <button aria-selected type="button" className="seedInfo__tab seedInfo__tab--active">
              Domain
            </button>
            <button aria-selected={false} type="button" className="seedInfo__tab">
              Asset
            </button>
          </div>

          <div className="seedInfo__toolbar">
            <form
              className="seedInfo__search"
              role="search"
              onSubmit={(event) => {
                event.preventDefault()
              }}
            >
              <label className="seedInfo__searchLabel" htmlFor="seed-info-search">
                Search domains
              </label>
              <input
                className="seedInfo__searchInput"
                id="seed-info-search"
                placeholder="Search by domain"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </form>
            <div className="seedInfo__toolbarButtons">
              <button
                className="seedInfo__actionButton seedInfo__actionButton--primary"
                type="button"
                onClick={() => {
                  setIsAddDialogOpen(true)
                  setAddDialogError(null)
                }}
              >
                + Add Domain
              </button>
              <button
                className="seedInfo__actionButton seedInfo__actionButton--primary"
                type="button"
                onClick={() => console.info('Start first scan')}
              >
                Start First Scan
              </button>
            </div>
          </div>
        </header>

        <div className="seedInfo__tableWrapper">
          <table className="seedInfo__table">
            <thead>
              <tr>
                <th scope="col">
                  <input
                    aria-label="Select all domains"
                    checked={filteredDomains.length > 0 && areAllVisibleSelected}
                    type="checkbox"
                    ref={selectAllRef}
                    onChange={(event) => toggleAllVisible(event.target.checked)}
                  />
                </th>
                <th scope="col">Domain</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDomains.length === 0 ? (
                <tr>
                  <td className="seedInfo__empty" colSpan={4}>
                    No domains match this filter.
                  </td>
                </tr>
              ) : (
                filteredDomains.map((domain) => {
                  const isSelected = selectedIds.has(domain.id)
                  return (
                    <tr key={domain.id}>
                      <td>
                        <input
                          aria-label={`Select ${domain.name}`}
                          checked={isSelected}
                          type="checkbox"
                          onChange={() => toggleSelection(domain.id)}
                        />
                      </td>
                      <td>{domain.name}</td>
                      <td>
                        <span className="seedInfo__status">
                          <span aria-hidden="true" className="seedInfo__statusDot" />
                          {statusLabel(domain.status)}
                        </span>
                      </td>
                      <td>
                        <div className="seedInfo__rowActions">
                          <button
                            className="seedInfo__rowButton"
                            type="button"
                            onClick={() => handleVerify(domain)}
                          >
                            Verify
                          </button>
                          <button
                            aria-label={`Delete ${domain.name}`}
                            className="seedInfo__iconButton"
                            disabled={rowDeletionId === domain.id || isBulkDeleting}
                            type="button"
                            onClick={() => {
                              void handleDelete(domain.id)
                            }}
                          >
                            <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16">
                              <path
                                d="M3 6h18M9 6V4h6v2m-7 4v8m4-8v8m4-8v8M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.6"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <footer className="seedInfo__footer">
          <div className="seedInfo__bulkActions">
            <button
              className="seedInfo__actionButton seedInfo__actionButton--primary"
              disabled={selectedIds.size === 0 || isBulkDeleting}
              type="button"
              onClick={() => {
                void handleDeleteSelected()
              }}
            >
              {isBulkDeleting ? 'Deleting…' : 'Delete Selected Domains'}
            </button>
            <button
              className="seedInfo__actionButton seedInfo__actionButton--primary"
              disabled={isSupportLoading}
              type="button"
              onClick={handleValidateBySupport}
            >
              {isSupportLoading ? 'Validating…' : 'Validate by Support'}
            </button>
          </div>
          <div className="seedInfo__pagination">
            <span className="seedInfo__paginationLabel">Showing 1 of 1</span>
            <div className="seedInfo__paginationButtons">
              <button
                aria-label="Previous page"
                className="seedInfo__iconButton"
                disabled
                type="button"
              >
                <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16">
                  <path
                    d="m14 6-6 6 6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                  />
                </svg>
              </button>
              <button
                aria-label="Next page"
                className="seedInfo__iconButton"
                disabled
                type="button"
              >
                <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16">
                  <path
                    d="m10 6 6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </footer>
      </section>

      {isAddDialogOpen ? (
        <div
          className="seedInfo__dialogOverlay"
          role="presentation"
          onClick={() => {
            closeAddDialog()
          }}
        >
          <div
            aria-labelledby="seed-info-dialog-title"
            className="seedInfo__dialog"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="seedInfo__dialogTitle" id="seed-info-dialog-title">
              Add Domain
            </h2>
            <form className="seedInfo__dialogForm" onSubmit={handleAddDomain}>
              <div className="seedInfo__dialogField">
                <label htmlFor="seed-info-domain">Domain</label>
                <input
                  id="seed-info-domain"
                  placeholder="example.com"
                  ref={dialogInputRef}
                  value={newDomainName}
                  onChange={(event) => {
                    setNewDomainName(event.target.value)
                    setAddDialogError(null)
                  }}
                />
              </div>
              {addDialogError ? <p className="seedInfo__dialogError">{addDialogError}</p> : null}
              <div className="seedInfo__dialogActions">
                <button
                  className="seedInfo__dialogButton seedInfo__dialogButton--ghost"
                  disabled={isAddDialogSubmitting}
                  type="button"
                  onClick={closeAddDialog}
                >
                  Cancel
                </button>
                <button
                  className="seedInfo__dialogButton seedInfo__dialogButton--primary"
                  disabled={isAddDialogSubmitting}
                  type="submit"
                >
                  {isAddDialogSubmitting ? 'Adding…' : 'Add Domain'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
