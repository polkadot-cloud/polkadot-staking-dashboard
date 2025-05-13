// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonCopy } from 'library/ButtonCopy'
import styled from 'styled-components'

interface CopyAddressProps {
  address: string
  display?: boolean
}

export const CopyAddress = ({ address, display = true }: CopyAddressProps) => (
  <Wrapper className="label">
    {display && <span>{address}</span>}
    <ButtonCopy value={address} size="1.2rem" />
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: monospace;
`
