// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Identity as Wrapper } from 'ui-core/list'
import { getIdentityDisplay } from '../../ValidatorList/ValidatorItem/Utils'
import type { IdentityProps } from '../types'

export const Identity = ({ address }: IdentityProps) => {
  const { validatorIdentities, validatorSupers, validatorsFetched } =
    useValidators()

  const [display, setDisplay] = useState<ReactNode>(
    getIdentityDisplay(validatorIdentities[address], validatorSupers[address])
  )

  useEffect(() => {
    setDisplay(
      getIdentityDisplay(validatorIdentities[address], validatorSupers[address])
    )
  }, [validatorSupers, validatorIdentities, address])

  return (
    <Wrapper>
      <div>
        <Polkicon address={address} fontSize="2rem" />
      </div>
      <div>
        {validatorsFetched && display !== null ? (
          <h4>{display}</h4>
        ) : (
          <h4>{ellipsisFn(address, 6)}</h4>
        )}
      </div>
    </Wrapper>
  )
}
