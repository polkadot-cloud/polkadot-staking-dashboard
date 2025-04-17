// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ellipsisFn, unitToPlanck } from '@w3ux/utils'
import { NewNominator } from 'api/tx/newNominator'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useSetup } from 'contexts/Setup'
import { useBatchCall } from 'hooks/useBatchCall'
import { usePayeeConfig } from 'hooks/usePayeeConfig'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { Warning } from 'library/Form/Warning'
import { Header } from 'library/SetupSteps/Header'
import { MotionContainer } from 'library/SetupSteps/MotionContainer'
import type { SetupStepProps } from 'library/SetupSteps/types'
import { SubmitTx } from 'library/SubmitTx'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import { SummaryWrapper } from './Wrapper'

export const Summary = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { newBatchCall } = useBatchCall()
  const { getPayeeItems } = usePayeeConfig()
  const { closeCanvas } = useOverlay().canvas
  const { accountHasSigner } = useImportedAccounts()
  const { activeAddress, activeProxy } = useActiveAccounts()
  const { getNominatorSetup, removeSetupProgress } = useSetup()
  const { unit, units } = getNetworkData(network)

  const setup = getNominatorSetup(activeAddress)
  const { progress } = setup
  const { bond, nominations, payee } = progress

  const getTxs = () => {
    if (!activeAddress) {
      return null
    }
    if (payee.destination === 'Account' && !payee.account) {
      return null
    }
    if (payee.destination !== 'Account' && !payee.destination) {
      return null
    }

    const tx = new NewNominator(
      network,
      unitToPlanck(bond || '0', units),
      payee.destination === 'Account'
        ? {
            type: 'Account' as const,
            value: payee.account as string,
          }
        : {
            type: payee.destination,
          },
      nominations.map(({ address }: { address: string }) => ({
        type: 'Id',
        value: address,
      }))
    ).tx()

    if (!tx) {
      return null
    }
    return newBatchCall(tx, activeAddress)
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tag: 'nominatorSetup',
    tx: getTxs(),
    from: activeAddress,
    shouldSubmit: true,
    callbackInBlock: () => {
      // Close the canvas after the extrinsic is included in a block.
      closeCanvas()

      // Reset setup progress.
      removeSetupProgress('nominator', activeAddress)
    },
  })

  const payeeDisplay =
    getPayeeItems().find(({ value }) => value === payee.destination)?.title ||
    payee.destination

  return (
    <>
      <Header
        thisSection={section}
        complete={null}
        title={t('summary')}
        bondFor="nominator"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {!(
          accountHasSigner(activeAddress) ||
          accountHasSigner(activeProxy?.address || null)
        ) && <Warning text={t('readOnly')} />}
        <SummaryWrapper>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('payoutDestination')}:
            </div>
            <div>
              {payee.destination === 'Account'
                ? `${payeeDisplay}: ${ellipsisFn(payee.account || '')}`
                : payeeDisplay}
            </div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('nominating')}:
            </div>
            <div>{t('validatorCount', { count: nominations.length })}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('bondAmount')}:
            </div>
            <div>
              {new BigNumber(bond || 0).toFormat()} {unit}
            </div>
          </section>
        </SummaryWrapper>
        <div
          style={{
            flex: 1,
            width: '100%',
            borderRadius: '1rem',
            overflow: 'hidden',
          }}
        >
          <SubmitTx
            submitText={t('startNominating')}
            valid
            {...submitExtrinsic}
            displayFor="canvas" /* Edge case: not canvas, but the larger button sizes suit this UI more. */
          />
        </div>
      </MotionContainer>
    </>
  )
}
