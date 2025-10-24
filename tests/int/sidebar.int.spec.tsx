import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

import SidebarLayout from '@/app/(frontend)/SidebarLayout'

describe('SidebarLayout navigation', () => {
  it('opens dropdown items when the parent is toggled', () => {
    render(
      <SidebarLayout adminHref="/admin">
        <div>Content</div>
      </SidebarLayout>,
    )

    const test1Toggle = screen.getByRole('button', { name: 'Test 1' })
    fireEvent.click(test1Toggle)

    const overviewItem = screen.getByRole('menuitem', { name: 'Overview', hidden: true })
    expect(overviewItem).toBeVisible()
  })
})
