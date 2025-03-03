// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ValidatorEntry } from '@w3ux/validator-assets'
import { useNetwork } from 'contexts/Network'
import { useOperators } from 'contexts/Operators'
import { useEffect, useState } from 'react'
import { Page } from 'ui-core/base'
import { Item } from './Item'
import { ItemsWrapper } from './Wrappers'
import { useOperatorsSections } from './context'

export const List = () => {
  const { network } = useNetwork()
  const { scrollPos } = useOperatorsSections()
  const { validatorOperators } = useOperators()

  const [entityItems, setEntityItems] = useState<ValidatorEntry[]>(
    validatorOperators.filter((v) => v.validators[network] !== undefined)
  )

  useEffect(() => {
    setEntityItems(
      validatorOperators.filter((v) => v.validators[network] !== undefined)
    )
  }, [network])

  useEffect(() => {
    window.scrollTo(0, scrollPos)
  }, [scrollPos])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: scrollPos ? 0 : 0.5,
        staggerChildren: scrollPos ? 0 : 0.025,
      },
    },
  }

  return (
    <Page.Row yMargin>
      <ItemsWrapper variants={container} initial="hidden" animate="show">
        {entityItems.map((item, index: number) => (
          <Item key={`operator_item_${index}`} item={item} actionable />
        ))}
      </ItemsWrapper>
    </Page.Row>
  )
}
