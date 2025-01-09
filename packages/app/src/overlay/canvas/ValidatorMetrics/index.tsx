// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Polkicon } from '@w3ux/react-polkicon'
import BigNumber from 'bignumber.js'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useTranslation } from 'react-i18next'
import { ButtonHelp, ButtonPrimary } from 'ui-buttons'
import {
  AccountTitle,
  GraphContainer,
  Head,
  Main,
  Stat,
  Subheading,
} from 'ui-core/canvas'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'

export const ValidatorMetrics = () => {
  const { t } = useTranslation()
  const {
    eraStakers: { stakers },
  } = useStaking()
  const {
    closeCanvas,
    config: { options },
  } = useOverlay().canvas
  const {
    networkData: {
      units,
      unit,
      brand: { token: Token },
    },
  } = useNetwork()
  const { openHelp } = useHelp()
  const validator = options!.validator
  const identity = options!.identity

  // is the validator in the active era
  const validatorInEra = stakers.find((s) => s.address === validator) || null

  let validatorOwnStake = new BigNumber(0)
  let otherStake = new BigNumber(0)
  if (validatorInEra) {
    const { others, own } = validatorInEra

    others.forEach(({ value }) => {
      otherStake = otherStake.plus(value)
    })
    if (own) {
      validatorOwnStake = new BigNumber(own)
    }
  }

  return (
    <Main>
      <Head>
        <ButtonPrimary
          text={t('pools.back', { ns: 'pages' })}
          lg
          onClick={() => closeCanvas()}
          iconLeft={faTimes}
          style={{ marginLeft: '1.1rem' }}
        />
      </Head>
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
              <h1>{identity}</h1>
            </div>
          </div>
        </div>
      </AccountTitle>
      <GraphContainer>
        <Subheading>
          <h4>
            <Stat withIcon>
              <Token />
              {t('selfStake', { ns: 'modals' })}:{' '}
              {planckToUnitBn(validatorOwnStake, units).toFormat()} {unit}
            </Stat>
            <Stat withIcon>
              <Token />
              {t('nominatorStake', { ns: 'modals' })}:{' '}
              {planckToUnitBn(otherStake, units).decimalPlaces(0).toFormat()}{' '}
              {unit}
            </Stat>
          </h4>
        </Subheading>
        <div>
          <Subheading>
            <h3>
              {t('recentPerformance', { ns: 'library' })}
              <ButtonHelp
                outline
                marginLeft
                onClick={() => openHelp('Era Points')}
              />
            </h3>
          </Subheading>
        </div>
      </GraphContainer>
    </Main>
  )
}
