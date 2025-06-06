// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { getSubscanBalanceChainId } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useTranslation } from 'react-i18next'
import { ButtonPrimaryInvert } from 'ui-buttons'
import { Separator } from 'ui-core/base'
import { MoreWrapper } from '../Wrappers'

export const BalanceLinks = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { isNominating } = useStaking()
  const { activeAddress } = useActiveAccounts()

  return (
    <MoreWrapper>
      <Separator />
      <h4>{t('moreResources')}</h4>
      <section>
        <ButtonPrimaryInvert
          lg
          onClick={() =>
            window.open(
              `https://${getSubscanBalanceChainId(network)}.subscan.io/account/${activeAddress}`,
              '_blank'
            )
          }
          iconRight={faExternalLinkAlt}
          iconTransform="shrink-2"
          text="Subscan"
          marginRight
          disabled={!activeAddress}
        />
        <ButtonPrimaryInvert
          lg
          onClick={() =>
            window.open(
              `https://${network}.polkawatch.app/nomination/${activeAddress}`,
              '_blank'
            )
          }
          iconRight={faExternalLinkAlt}
          iconTransform="shrink-2"
          text="Polkawatch"
          disabled={
            !(
              activeAddress &&
              ['polkadot', 'kusama'].includes(network) &&
              isNominating
            )
          }
        />
      </section>
    </MoreWrapper>
  )
}
