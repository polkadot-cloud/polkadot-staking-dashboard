// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isValidAddress, planckToUnit, unitToPlanck } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { Warning } from 'library/Form/Warning'
import { Spacer } from 'library/Form/Wrappers'
import { SubmitTx } from 'library/SubmitTx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import { ButtonSubmitInvert } from 'ui-buttons'
import { Padding, Title, Warnings } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

const SendFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1rem 0;

  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    label {
      display: block;
      color: var(--text-color-primary);
      margin-bottom: 0.25rem;
      font-size: 1rem;
      font-family: InterSemiBold, sans-serif;
      text-transform: capitalize;
    }
  }
`

const InputWrapper = styled.div`
  width: 100%;
  position: relative;

  .inner {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;

    section {
      &:first-child {
        flex-grow: 1;
        margin-right: 0.5rem;
      }
    }
  }

  .input {
    background: var(--input-background-color);
    border-radius: 1rem;
    border: 1px solid var(--border-primary-color);
    display: flex;
    flex-direction: column;
    padding: 0.75rem 1rem;

    > div {
      &:first-child {
        display: flex;
        align-items: center;

        input {
          font-family: InterSemiBold, sans-serif;
          width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          background: none;
          border: none;
          margin: 0;
          padding: 0;
          font-size: 1.2rem;

          &:focus-visible {
            outline: none;
          }

          &::placeholder {
            color: var(--text-color-tertiary);
          }
        }
      }

      /* The balance display */
      &:last-child {
        p {
          color: var(--text-color-secondary);
          font-size: 0.9rem;
          font-family: InterRegular, sans-serif;
          padding: 0.25rem 0 0 0;
          margin: 0;
        }
      }
    }
  }
`

const AmountWrapper = styled.div`
  width: 100%;

  .amount-row {
    display: flex;
    align-items: center;

    .amount-input-wrapper {
      flex-grow: 1;
      margin-right: 0.5rem;
      position: relative;
    }

    .max-button {
      height: 100%;
      padding: 0.65rem 0;
      width: 4.5rem;
      border-radius: 1.5rem;
      text-transform: capitalize;
      font-size: 0.95rem;
    }
  }

  .amount-input {
    border-radius: 1rem;
    border: 1px solid var(--border-primary-color);
    background: var(--input-background-color);
    padding: 0.8rem 1rem;
    display: flex;
    align-items: center;
    width: 100%;

    input {
      border: none;
      background: none;
      width: 50%;
      outline: none;
      padding: 0;
      margin: 0;
      font-family: InterSemiBold, sans-serif;
      font-size: 1.2rem;

      &::placeholder {
        color: var(--text-color-tertiary);
      }
    }

    .available {
      margin-left: auto;
      color: var(--text-color-secondary);
      font-size: 0.9rem;
      white-space: nowrap;
    }
  }
`

export const Send = () => {
  const { t } = useTranslation('modals')
  const { setModalStatus, setModalResize } = useOverlay().modal
  const { serviceApi } = useApi()
  const { network } = useNetwork()
  const { activeAddress } = useActiveAccounts()
  const { getSignerWarnings } = useSignerWarnings()
  const { feeReserve, getTransferOptions } = useTransferOptions()
  const { unit, units } = getNetworkData(network)

  // Get the user's transferrable balance
  const { transferrableBalance } = getTransferOptions(activeAddress)

  // Calculate the max amount user can send (taking into account tx fees)
  const freeToSend = new BigNumber(
    planckToUnit(transferrableBalance - feeReserve, units)
  )

  // Recipient address state
  const [recipientAddress, setRecipientAddress] = useState<string>('')

  // Amount to send state
  const [amount, setAmount] = useState<string>('')

  // Form validation state
  const [formValid, setFormValid] = useState(false)

  // Set form validity whenever inputs change
  useEffect(() => {
    const amountNum = new BigNumber(amount || '0')
    const amountValid =
      amountNum.isGreaterThan(0) && amountNum.isLessThanOrEqualTo(freeToSend)
    const recipientValid =
      !!recipientAddress && isValidAddress(recipientAddress)

    setFormValid(amountValid && recipientValid)
  }, [amount, recipientAddress, freeToSend.toString()])

  // Handle address change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(e.target.value)
  }

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setAmount(value)
  }

  // Handle max button click
  const handleMaxClick = () => {
    setAmount(freeToSend.toString())
  }

  // Create the transaction
  const getTx = () => {
    if (!activeAddress || !recipientAddress || !amount) {
      return
    }

    const amountBigInt = unitToPlanck(amount, units)
    return serviceApi.tx.transferKeepAlive(recipientAddress, amountBigInt)
  }

  // Submit the transaction
  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: formValid,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  // Get signer warnings
  const warnings = getSignerWarnings(
    activeAddress,
    false,
    submitExtrinsic.proxySupported
  )

  // Modal resize on form update
  useEffect(
    () => setModalResize(),
    [amount, recipientAddress, formValid, warnings.length]
  )

  return (
    <>
      <Close />
      <Padding>
        <Title>
          {t('send')} {unit}
        </Title>

        {warnings.length > 0 && (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </Warnings>
        )}

        <SendFormWrapper>
          <div className="input-wrapper">
            <label>{t('recipient')}</label>
            <InputWrapper>
              <div className="inner">
                <section>
                  <div className="input">
                    <div>
                      <input
                        type="text"
                        placeholder={t('enterRecipientAddress')}
                        value={recipientAddress}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>
                </section>
              </div>
            </InputWrapper>
          </div>

          <div className="input-wrapper">
            <label>{t('amount')}</label>
            <AmountWrapper>
              <div className="amount-row">
                <div className="amount-input-wrapper">
                  <div className="amount-input">
                    <input
                      type="text"
                      placeholder={`0 ${unit}`}
                      value={amount}
                      onChange={handleAmountChange}
                    />
                    <div className="available">
                      {`${freeToSend.toFormat()} ${unit} ${t('available')}`}
                    </div>
                  </div>
                </div>
                <ButtonSubmitInvert
                  className="max-button"
                  text={t('max')}
                  disabled={freeToSend.isZero()}
                  onClick={handleMaxClick}
                />
              </div>
            </AmountWrapper>
          </div>
        </SendFormWrapper>
        <Spacer />
        <p>{t('sendFundsInfo')}</p>
      </Padding>
      <SubmitTx valid={formValid} {...submitExtrinsic} />
    </>
  )
}
