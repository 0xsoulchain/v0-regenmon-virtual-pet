'use client'

import React from 'react'
import { PrivyProvider } from '@privy-io/react-auth'

export function PrivyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider appId="cmkyyrsbj04bck40bidlscndo">
      {children}
    </PrivyProvider>
  )
}
