// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon'
import { AccountTitle, Main } from 'ui-core/canvas'
import { useOverlay } from 'ui-overlay'

export const ValidatorMetrics = () => {
  const {
    config: { options },
  } = useOverlay().canvas

  const validator = options!.validator

  return (
    <Main>
      <AccountTitle>
        <div>
          <div>
            <Polkicon
              address={validator}
              background="transparent"
              fontSize="4rem"
            />
          </div>
          <div>
            <div className="title">
              <h1>Title</h1>
            </div>
          </div>
        </div>
      </AccountTitle>
    </Main>
  )
}
