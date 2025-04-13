// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTimeLeft } from '@w3ux/hooks'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { fromUnixTime } from 'date-fns'
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft'
import { useUnstaking } from 'hooks/useUnstaking'
import { Countdown } from 'library/Countdown'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmit } from 'ui-buttons'
import { formatTimeleft, planckToUnitBn } from 'utils'
import { ChunkWrapper } from './Wrappers'
import type { ChunkProps } from './types'

export const Chunk = ({ chunk, bondFor, onRebond }: ChunkProps) => {
  const { t, i18n } = useTranslation('modals')

  const { activeEra } = useApi()
  const { network } = useNetwork()
  const { isFastUnstaking } = useUnstaking()
  const { activeAddress } = useActiveAccounts()
  const { erasToSeconds } = useErasToTimeLeft()

  const { timeleft, setFromNow } = useTimeLeft({
    depsTimeleft: [network],
    depsFormat: [i18n.resolvedLanguage],
  })

  const { unit, units } = getNetworkData(network)
  const isStaking = bondFor === 'nominator'
  const { era, value } = chunk
  const left = new BigNumber(era).minus(activeEra.index)
  const start = activeEra.start.multipliedBy(0.001)
  const erasDuration = erasToSeconds(left)

  const dateFrom = fromUnixTime(start.toNumber())
  const dateTo = fromUnixTime(start.plus(erasDuration).toNumber())
  const formatted = formatTimeleft(t, timeleft.raw)

  // reset timer on account or network change.
  useEffect(() => {
    setFromNow(dateFrom, dateTo)
  }, [activeAddress, network])

  return (
    <ChunkWrapper>
      <div>
        <section>
          <h2>{`${planckToUnitBn(new BigNumber(value), units)} ${unit}`}</h2>
          <h4>
            {left.isLessThanOrEqualTo(0) ? (
              t('unlocked')
            ) : (
              <>
                {t('unlocksInEra')} {era} /&nbsp;
                <Countdown timeleft={formatted} markup={false} />
              </>
            )}
          </h4>
        </section>
        {isStaking ? (
          <section>
            <div>
              <ButtonSubmit
                text={t('rebond')}
                disabled={isFastUnstaking}
                onClick={() => onRebond(chunk)}
              />
            </div>
          </section>
        ) : null}
      </div>
    </ChunkWrapper>
  )
}
