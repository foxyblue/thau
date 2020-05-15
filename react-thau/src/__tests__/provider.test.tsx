import * as React from 'react'
import { render } from '@testing-library/react'
import { AuthProvider } from '..'

it('Should render the AuthProvider anyway', () => {
  const renderResult = render(<AuthProvider authUrl='' />)
  expect(renderResult).not.toBeFalsy()
})