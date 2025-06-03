// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PageProps } from 'common-types'
import { asOperatorsSupportedNetwork } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { Entity } from './Entity'
import { List } from './List'
import { Wrapper } from './Wrappers'
import { OperatorsSectionsProvider, useOperatorsSections } from './context'

export const OperatorsInner = ({ page }: PageProps) => {
  const { t } = useTranslation('app')
  const { network: networkDefault } = useNetwork()
  const { activeSection } = useOperatorsSections()

  const network = asOperatorsSupportedNetwork(networkDefault)
  if (!network) {
    return null
  }
  const { key } = page

  return (
    <Wrapper>
      <Page.Title title={t(key)} />
      {activeSection === 0 && <List network={network} />}
      {activeSection === 1 && <Entity network={network} />}
    </Wrapper>
  )
}

export const Operators = (props: PageProps) => (
  <OperatorsSectionsProvider>
    <OperatorsInner {...props} />
  </OperatorsSectionsProvider>
)
