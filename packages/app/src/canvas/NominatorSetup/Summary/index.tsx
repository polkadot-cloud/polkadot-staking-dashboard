// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn, unitToPlanck } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useNetwork } from 'contexts/Network';
import { useSetup } from 'contexts/Setup';
import { Apis } from 'controllers/Apis';
import { useBatchCall } from 'hooks/useBatchCall';
import { usePayeeConfig } from 'hooks/usePayeeConfig';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { Warning } from 'library/Form/Warning';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import type { SetupStepProps } from 'library/SetupSteps/types';
import { SubmitTx } from 'library/SubmitTx';
import { useTranslation } from 'react-i18next';
import { SummaryWrapper } from './Wrapper';

export const Summary = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages');
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { newBatchCall } = useBatchCall();
  const { getPayeeItems } = usePayeeConfig();
  const { closeCanvas } = useOverlay().canvas;
  const { accountHasSigner } = useImportedAccounts();
  const { activeAccount, activeProxy } = useActiveAccounts();
  const { getNominatorSetup, removeSetupProgress } = useSetup();

  const setup = getNominatorSetup(activeAccount);
  const { progress } = setup;
  const { bond, nominations, payee } = progress;

  const getTxs = () => {
    const api = Apis.getApi(network);
    if (!activeAccount || !api) {
      return null;
    }

    if (payee.destination === 'Account' && !payee.account) {
      return null;
    }

    if (payee.destination !== 'Account' && !payee.destination) {
      return null;
    }

    const payeeToSubmit =
      payee.destination === 'Account'
        ? {
            type: 'Account' as const,
            value: payee.account as string,
          }
        : {
            type: payee.destination,
          };

    const bondToSubmit = unitToPlanck(bond || '0', units).toString();

    const txs = [
      api.tx.Staking.bond({
        value: BigInt(bondToSubmit),
        payee: payeeToSubmit,
      }),
      api.tx.Staking.nominate({
        targets: nominations.map(({ address }: { address: string }) => ({
          type: 'Id',
          value: address,
        })),
      }),
    ];
    return newBatchCall(txs, activeAccount);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTxs(),
    from: activeAccount,
    shouldSubmit: true,
    callbackInBlock: () => {
      // Close the canvas after the extrinsic is included in a block.
      closeCanvas();

      // Reset setup progress.
      removeSetupProgress('nominator', activeAccount);
    },
  });

  const payeeDisplay =
    getPayeeItems().find(({ value }) => value === payee.destination)?.title ||
    payee.destination;

  return (
    <>
      <Header
        thisSection={section}
        complete={null}
        title={t('nominate.summary')}
        bondFor="nominator"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {!(
          accountHasSigner(activeAccount) || accountHasSigner(activeProxy)
        ) && <Warning text={t('nominate.readOnly')} />}
        <SummaryWrapper>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('nominate.payoutDestination')}:
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
              {t('nominate.nominating')}:
            </div>
            <div>{t('nominate.validator', { count: nominations.length })}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon icon={faCheckCircle} transform="grow-1" /> &nbsp;{' '}
              {t('nominate.bondAmount')}:
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
            submitText={t('nominate.startNominating')}
            valid
            {...submitExtrinsic}
            displayFor="canvas" /* Edge case: not canvas, but the larger button sizes suit this UI more. */
          />
        </div>
      </MotionContainer>
    </>
  );
};
