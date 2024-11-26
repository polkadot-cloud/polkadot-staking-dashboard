// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { unitToPlanck } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from 'contexts/Api';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useNetwork } from 'contexts/Network';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useSetup } from 'contexts/Setup';
import { ApiController } from 'controllers/Api';
import { useBatchCall } from 'hooks/useBatchCall';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { Warning } from 'library/Form/Warning';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import type { SetupStepProps } from 'library/SetupSteps/types';
import { SubmitTx } from 'library/SubmitTx';
import { Binary } from 'polkadot-api';
import { useTranslation } from 'react-i18next';
import { SummaryWrapper } from './Wrapper';

export const Summary = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages');
  const {
    poolsConfig: { lastPoolId },
  } = useApi();
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { newBatchCall } = useBatchCall();
  const { closeCanvas } = useOverlay().canvas;
  const { accountHasSigner } = useImportedAccounts();
  const { getPoolSetup, removeSetupProgress } = useSetup();
  const { activeAccount, activeProxy } = useActiveAccounts();
  const { queryBondedPool, addToBondedPools } = useBondedPools();

  const poolId = lastPoolId.plus(1);
  const setup = getPoolSetup(activeAccount);
  const { progress } = setup;

  const { metadata, bond, roles, nominations } = progress;

  const getTxs = () => {
    const { pApi } = ApiController.get(network);
    if (!activeAccount || !pApi) {
      return null;
    }

    const targetsToSubmit = nominations.map(
      ({ address }: { address: string }) => address
    );

    const bondToSubmit = unitToPlanck(bond, units).toString();

    const txs = [
      pApi.tx.NominationPools.create({
        amount: BigInt(bondToSubmit.toString()),
        root: {
          type: 'Id',
          value: roles?.root || activeAccount,
        },
        nominator: {
          type: 'Id',
          value: roles?.nominator || activeAccount,
        },
        bouncer: {
          type: 'Id',
          value: roles?.bouncer || activeAccount,
        },
      }),

      pApi.tx.NominationPools.nominate({
        pool_id: poolId.toNumber(),
        validators: targetsToSubmit,
      }),
      pApi.tx.NominationPools.set_metadata({
        pool_id: poolId.toNumber(),
        metadata: Binary.fromText(metadata),
      }),
    ];
    return newBatchCall(txs, activeAccount);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTxs(),
    from: activeAccount,
    shouldSubmit: true,
    callbackInBlock: async () => {
      // Close canvas.
      closeCanvas();

      // Query and add created pool to bondedPools list.
      const pool = await queryBondedPool(poolId.toNumber());
      addToBondedPools(pool);

      // Reset setup progress.
      removeSetupProgress('pool', activeAccount);
    },
  });

  return (
    <>
      <Header
        thisSection={section}
        complete={null}
        title={t('pools.summary')}
        bondFor="pool"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {!(
          accountHasSigner(activeAccount) || accountHasSigner(activeProxy)
        ) && <Warning text={t('pools.readOnly')} />}
        <SummaryWrapper>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('pools.poolName')}:
            </div>
            <div>{metadata ?? `${t('pools.notSet')}`}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('pools.bondAmount')}:
            </div>
            <div>
              {new BigNumber(bond).toFormat()} {unit}
            </div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;
              {t('pools.nominating')}:
            </div>
            <div>{t('nominate.validator', { count: nominations.length })}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('pools.roles')}:
            </div>
            <div>{t('pools.assigned')}</div>
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
            submitText={t('pools.createPool')}
            valid
            {...submitExtrinsic}
            displayFor="canvas" /* Edge case: not canvas, but the larger button sizes suit this UI more. */
          />
        </div>
      </MotionContainer>
    </>
  );
};
