'use client'

import React from 'react'

type DomainEntry = {
  id: string
  name: string
}

type SeedInformationContentProps = {
  initialDomains?: DomainEntry[]
}

const DEFAULT_DOMAINS: DomainEntry[] = [
  { id: 'domain-1', name: 'acme-security.com' },
  { id: 'domain-2', name: 'contoso.net' },
  { id: 'domain-3', name: 'payloadcms.dev' },
  { id: 'domain-4', name: 'example.org' },
]

export default function SeedInformationContent({
  initialDomains = DEFAULT_DOMAINS,
}: SeedInformationContentProps) {
  const [domains, setDomains] = React.useState<DomainEntry[]>(initialDomains)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => new Set())
  const [isSupportLoading, setIsSupportLoading] = React.useState(false)
  const selectAllRef = React.useRef<HTMLInputElement>(null)

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

  const handleDelete = (id: string) => {
    setDomains((prev) => prev.filter((domain) => domain.id !== id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    console.info(`Domain ${id} removed`)
  }

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) {
      return
    }

    setDomains((prev) => prev.filter((domain) => !selectedIds.has(domain.id)))
    setSelectedIds(new Set())
    console.info('Selected domains deleted')
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

  return (
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
              onClick={() => console.info('Add domain')}
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
                        Pending Verification
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
                          type="button"
                          onClick={() => handleDelete(domain.id)}
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
            type="button"
            onClick={handleDeleteSelected}
          >
            Delete Selected Domains
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
  )
}
