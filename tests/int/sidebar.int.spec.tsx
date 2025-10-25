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

    const attackSurfaceToggle = screen.getAllByRole('button', { name: 'Attack Surface' }).at(-1)
    expect(attackSurfaceToggle).toBeTruthy()
    fireEvent.click(attackSurfaceToggle!)

    const menuItems = screen.getAllByRole('menuitem', { name: 'Asset Exposure', hidden: true })
    const menuItem = menuItems.at(-1)
    if (!menuItem) {
      throw new Error('Expected Asset Exposure dropdown item to be present')
    }
    expect(menuItem).toBeVisible()
  })

  it('closes an open dropdown when toggled again', () => {
    render(
      <SidebarLayout adminHref="/admin">
        <div>Content</div>
      </SidebarLayout>,
    )

    const attackSurfaceToggle = screen.getAllByRole('button', { name: 'Attack Surface' }).at(-1)
    expect(attackSurfaceToggle).toBeTruthy()
    fireEvent.click(attackSurfaceToggle!)

    const menuItems = screen.getAllByRole('menuitem', { name: 'Asset Exposure', hidden: true })
    const menuItem = menuItems.at(-1)
    if (!menuItem) {
      throw new Error('Expected Asset Exposure dropdown item to be present')
    }
    expect(menuItem).toBeVisible()

    fireEvent.click(attackSurfaceToggle!)
    expect(menuItem).not.toBeVisible()
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

    const attackSurfaceToggle = screen.getAllByRole('button', { name: 'Attack Surface' }).at(-1)
    expect(attackSurfaceToggle).toBeTruthy()
    fireEvent.click(attackSurfaceToggle!)

    await waitFor(() => {
      expect(layout).toHaveAttribute('data-collapsed', 'false')
    })

    const menuItems = screen.getAllByRole('menuitem', { name: 'Asset Exposure', hidden: true })
    const menuItem = menuItems.at(-1)
    if (!menuItem) {
      throw new Error('Expected Asset Exposure dropdown item to be present')
    }
    expect(menuItem).toBeVisible()
  })
})
