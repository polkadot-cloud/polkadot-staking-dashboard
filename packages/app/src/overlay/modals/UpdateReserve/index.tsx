// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { planckToUnit, unitToPlanck } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useTransferOptions } from 'contexts/TransferOptions'
import { Title } from 'library/Modal/Title'
import { StyledSlider } from 'library/StyledSlider'
import { SliderWrapper } from 'overlay/modals/ManagePool/Wrappers'
import 'rc-slider/assets/index.css'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonHelp, ButtonPrimaryInvert } from 'ui-buttons'
import { CardHeader } from 'ui-core/base'
import { Padding } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'

export const UpdateReserve = () => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { openHelp } = useHelp()
  const { setModalStatus } = useOverlay().modal
  const { activeAddress } = useActiveAccounts()
  const { accountHasSigner } = useImportedAccounts()
  const { feeReserve, setFeeReserveBalance, getTransferOptions } =
    useTransferOptions()

  const { unit, units } = getNetworkData(network)
  const { edReserved } = getTransferOptions(activeAddress)
  const minReserve = new BigNumber(planckToUnit(edReserved, units))
  const maxReserve = minReserve.plus(
    ['polkadot', 'westend'].includes(network) ? 3 : 1
  )

  const [sliderReserve, setSliderReserve] = useState<number>(
    planckToUnitBn(new BigNumber(feeReserve), units)
      .plus(minReserve)
      .decimalPlaces(3)
      .toNumber()
  )

  const handleChange = (val: BigNumber) => {
    // deduct ED from reserve amount.
    val = val.decimalPlaces(3)
    const actualReserve = BigNumber.max(val.minus(minReserve), 0).toNumber()
    const actualReservePlanck = unitToPlanck(actualReserve.toString(), units)
    setSliderReserve(val.decimalPlaces(3).toNumber())
    setFeeReserveBalance(actualReservePlanck)
  }

  return (
    <Padding>
      <Title
        title={t('reserveBalance')}
        helpKey="Reserve Balance"
        style={{ padding: '0.5rem 0 0 0' }}
      />
      <SliderWrapper style={{ marginTop: '1rem' }}>
        <p>{t('reserveText', { unit })}</p>
        <div>
          <StyledSlider
            classNaame="no-padding"
            min={0}
            max={maxReserve.toNumber()}
            value={sliderReserve}
            step={0.01}
            onChange={(val) => {
              if (typeof val === 'number' && val >= minReserve.toNumber()) {
                handleChange(new BigNumber(val))
              }
            }}
          />
        </div>
        <div className="stats">
          <CardHeader>
            <h4>
              {t('reserveForExistentialDeposit')}
              <FontAwesomeIcon
                icon={faLock}
                transform="shrink-3"
                style={{ marginLeft: '0.5rem' }}
              />
            </h4>
            <h2>
              {minReserve.isZero() ? (
                <>
                  {t('none')}
                  <ButtonHelp
                    onClick={() =>
                      openHelp('Reserve Balance For Existential Deposit')
                    }
                    style={{ marginLeft: '0.65rem' }}
                  />
                </>
              ) : (
                `${minReserve.decimalPlaces(4).toString()} ${unit}`
              )}
            </h2>
          </CardHeader>
          <CardHeader>
            <h4>{t('reserveForTxFees')}</h4>
            <h2>
              {BigNumber.max(
                new BigNumber(sliderReserve)
                  .minus(minReserve)
                  .decimalPlaces(4)
                  .toString(),
                0
              ).toString()}
              &nbsp;
              {unit}
            </h2>
          </CardHeader>
        </div>
        <div className="done">
          <ButtonPrimaryInvert
            text={t('done')}
            onClick={() => setModalStatus('closing')}
            disabled={!accountHasSigner(activeAddress)}
          />
        </div>
      </SliderWrapper>
    </Padding>
  )
}
