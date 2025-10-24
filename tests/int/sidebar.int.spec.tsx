import { describe, it, expect, afterEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import SidebarLayout from '@/app/(frontend)/SidebarLayout'

const originalInnerWidth = window.innerWidth

const setWindowInnerWidth = (value: number) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value,
  })
}

afterEach(() => {
  setWindowInnerWidth(originalInnerWidth)
})

describe('SidebarLayout navigation', () => {
  it('opens dropdown items when the parent is toggled', () => {
    render(
      <SidebarLayout adminHref="/admin">
        <div>Content</div>
      </SidebarLayout>,
    )

    const test1Toggle = screen.getAllByRole('button', { name: 'Test 1' }).at(-1)
    expect(test1Toggle).toBeTruthy()
    fireEvent.click(test1Toggle!)

    const overviewItems = screen.getAllByRole('menuitem', { name: 'Overview', hidden: true })
    const overviewItem = overviewItems.at(-1)
    if (!overviewItem) {
      throw new Error('Expected Overview dropdown item to be present')
    }
    expect(overviewItem).toBeVisible()
  })

  it('closes an open dropdown when toggled again', () => {
    render(
      <SidebarLayout adminHref="/admin">
        <div>Content</div>
      </SidebarLayout>,
    )

    const test1Toggle = screen.getAllByRole('button', { name: 'Test 1' }).at(-1)
    expect(test1Toggle).toBeTruthy()
    fireEvent.click(test1Toggle!)

    const overviewItems = screen.getAllByRole('menuitem', { name: 'Overview', hidden: true })
    const overviewItem = overviewItems.at(-1)
    if (!overviewItem) {
      throw new Error('Expected Overview dropdown item to be present')
    }
    expect(overviewItem).toBeVisible()

    fireEvent.click(test1Toggle!)
    expect(overviewItem).not.toBeVisible()
  })

  it('expands the sidebar before showing a dropdown when collapsed', async () => {
    setWindowInnerWidth(800)

    const { container } = render(
      <SidebarLayout adminHref="/admin">
        <div>Content</div>
      </SidebarLayout>,
    )

    const layout = container.querySelector('.appLayout')
    expect(layout).toBeTruthy()

    await waitFor(() => {
      expect(layout).toHaveAttribute('data-collapsed', 'true')
    })

    const test1Toggle = screen.getAllByRole('button', { name: 'Test 1' }).at(-1)
    expect(test1Toggle).toBeTruthy()
    fireEvent.click(test1Toggle!)

    await waitFor(() => {
      expect(layout).toHaveAttribute('data-collapsed', 'false')
    })

    const overviewItems = screen.getAllByRole('menuitem', { name: 'Overview', hidden: true })
    const overviewItem = overviewItems.at(-1)
    if (!overviewItem) {
      throw new Error('Expected Overview dropdown item to be present')
    }
    expect(overviewItem).toBeVisible()
  })
})
