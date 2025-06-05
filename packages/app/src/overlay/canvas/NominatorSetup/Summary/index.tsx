// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ellipsisFn, unitToPlanck } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useNominatorSetups } from 'contexts/NominatorSetups'
import type { PalletStakingRewardDestination } from 'dedot/chaintypes'
import { AccountId32 } from 'dedot/codecs'
import { useBatchCall } from 'hooks/useBatchCall'
import { usePayeeConfig } from 'hooks/usePayeeConfig'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { Warning } from 'library/Form/Warning'
import { Header } from 'library/SetupSteps/Header'
import { MotionContainer } from 'library/SetupSteps/MotionContainer'
import type { SetupStepProps } from 'library/SetupSteps/types'
import { SubmitTx } from 'library/SubmitTx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Separator } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { Bond } from '../Bond'
import { SummaryWrapper } from './Wrapper'

export const Summary = ({
  section,
  simple,
}: SetupStepProps & {
  simple: boolean
}) => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { serviceApi } = useApi()
  const { newBatchCall } = useBatchCall()
  const { getPayeeItems } = usePayeeConfig()
  const { closeCanvas } = useOverlay().canvas
  const { accountHasSigner } = useImportedAccounts()
  const { activeAddress, activeProxy } = useActiveAccounts()
  const { getNominatorSetup, removeNominatorSetup } = useNominatorSetups()
  const { unit, units } = getStakingChainData(network)

  // Track whether bond is valid
  const [bondValid, setBondValid] = useState<boolean>(false)

  const setup = getNominatorSetup(activeAddress)
  const { progress } = setup
  const { bond, nominations, payee } = progress

  const getTxs = () => {
    if (!activeAddress) {
      return
    }
    if (payee.destination === 'Account' && !payee.account) {
      return
    }
    if (payee.destination !== 'Account' && !payee.destination) {
      return
    }
    const destinationParam: PalletStakingRewardDestination =
      payee.destination === 'Account'
        ? {
            type: 'Account' as const,
            value: new AccountId32(payee.account as string),
          }
        : {
            type: payee.destination,
          }
    const nominationsParam = nominations.map(
      ({ address }: { address: string }) => address
    )
    const tx = serviceApi.tx.newNominator(
      unitToPlanck(bond || '0', units),
      destinationParam,
      nominationsParam
    )
    if (!tx) {
      return
    }
    return newBatchCall(tx, activeAddress)
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tag: 'nominatorSetup',
    tx: getTxs(),
    from: activeAddress,
    shouldSubmit: true,
    callbackInBlock: () => {
      // Close the canvas after the extrinsic is included in a block
      closeCanvas()
      // Reset setup progress
      removeNominatorSetup(activeAddress)
    },
  })

  const payeeDisplay =
    getPayeeItems().find(({ value }) => value === payee.destination)?.title ||
    payee.destination

  return (
    <>
      {!simple && (
        <Header
          thisSection={section}
          complete={null}
          title={t('summary')}
          bondFor="nominator"
        />
      )}
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {!(
          accountHasSigner(activeAddress) ||
          accountHasSigner(activeProxy?.address || null)
        ) && <Warning text={t('readOnly')} />}
        <SummaryWrapper style={{ marginTop: simple ? '0' : '1rem' }}>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-12" />
            </div>
            <div>
              <h4>{t('payoutDestination')}</h4>
              <h2>
                {payee.destination === 'Account'
                  ? `${payeeDisplay}: ${ellipsisFn(payee.account || '')}`
                  : payeeDisplay}
              </h2>
            </div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-12" />
            </div>
            <div>
              <h4>{t('nominating')}</h4>
              <h2>{t('validatorCount', { count: nominations.length })}</h2>
            </div>
          </section>
          {!simple ? (
            <section>
              <div>
                <FontAwesomeIcon icon={faCheckCircle} transform="grow-12" />
              </div>
              <div>
                <h4>{t('bondAmount')}:</h4>
                <h2>
                  {new BigNumber(bond || 0).toFormat()} {unit}
                </h2>
              </div>
            </section>
          ) : (
            <div style={{ padding: '1rem 0.5rem', width: '100%' }}>
              <Separator transparent />
              <Bond section={4} inline={true} handleBondValid={setBondValid} />
            </div>
          )}
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
            valid={bondValid}
            {...submitExtrinsic}
            displayFor="canvas"
          />
        </div>
      </MotionContainer>
    </>
  )
}
