// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PageProps } from 'common-types'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { Entity } from './Entity'
import { List } from './List'
import { Wrapper } from './Wrappers'
import { OperatorsSectionsProvider, useOperatorsSections } from './context'

export const OperatorsInner = ({ page }: PageProps) => {
  const { t } = useTranslation('app')
  const { activeSection } = useOperatorsSections()

  const { key } = page

  return (
    <Wrapper>
      <Page.Title title={t(key)} />
      {activeSection === 0 && <List />}
      {activeSection === 1 && <Entity />}
    </Wrapper>
  )
}

export const Operators = (props: PageProps) => (
  <OperatorsSectionsProvider>
    <OperatorsInner {...props} />
  </OperatorsSectionsProvider>
)
