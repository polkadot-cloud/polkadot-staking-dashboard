// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { unitToPlanck } from '@w3ux/utils'
import { CreatePool } from 'api/tx/createPool'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useSetup } from 'contexts/Setup'
import { useBatchCall } from 'hooks/useBatchCall'
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
  const {
    poolsConfig: { lastPoolId },
  } = useApi()
  const {
    network,
    networkData: { units, unit },
  } = useNetwork()
  const { newBatchCall } = useBatchCall()
  const { closeCanvas } = useOverlay().canvas
  const { accountHasSigner } = useImportedAccounts()
  const { getPoolSetup, removeSetupProgress } = useSetup()
  const { activeAccount, activeProxy } = useActiveAccounts()
  const { queryBondedPool, addToBondedPools } = useBondedPools()

  const poolId = lastPoolId.plus(1)
  const setup = getPoolSetup(activeAccount)
  const { progress } = setup

  const { metadata, bond, roles, nominations } = progress

  const getTx = () => {
    if (!activeAccount) {
      return null
    }

    const tx = new CreatePool(
      network,
      activeAccount,
      poolId.toNumber(),
      unitToPlanck(bond, units),
      metadata,
      nominations.map(({ address }) => address),
      roles
    ).tx()

    if (!tx) {
      return null
    }
    return newBatchCall(tx, activeAccount)
  }
  const submitExtrinsic = useSubmitExtrinsic({
    tag: 'createPool',
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackInBlock: async () => {
      // Close canvas.
      closeCanvas()

      // Query and add created pool to bondedPools list.
      const pool = await queryBondedPool(poolId.toNumber())
      addToBondedPools(pool)

      // Reset setup progress.
      removeSetupProgress('pool', activeAccount)
    },
  })

  return (
    <>
      <Header
        thisSection={section}
        complete={null}
        title={t('summary')}
        bondFor="pool"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {!(
          accountHasSigner(activeAccount) || accountHasSigner(activeProxy)
        ) && <Warning text={t('readOnly')} />}
        <SummaryWrapper>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('poolName')}:
            </div>
            <div>{metadata ?? `${t('notSet')}`}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('bondAmount')}:
            </div>
            <div>
              {new BigNumber(bond).toFormat()} {unit}
            </div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;
              {t('nominating')}:
            </div>
            <div>{t('validatorCount', { count: nominations.length })}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('roles')}:
            </div>
            <div>{t('assigned')}</div>
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
            submitText={t('createPool')}
            valid
            {...submitExtrinsic}
            displayFor="canvas" /* Edge case: not canvas, but the larger button sizes suit this UI more. */
          />
        </div>
      </MotionContainer>
    </>
  )
}
