// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn, unitToPlanck } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useSetup } from 'contexts/Setup';
import { Warning } from 'library/Form/Warning';
import { useBatchCall } from 'library/Hooks/useBatchCall';
import { usePayeeConfig } from 'library/Hooks/usePayeeConfig';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import type { SetupStepProps } from 'library/SetupSteps/types';
import { SubmitTx } from 'library/SubmitTx';
import { useNetwork } from 'contexts/Network';
import { useApi } from 'contexts/Api';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { SummaryWrapper } from './Wrapper';

export const Summary = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages');
  const { api } = useApi();
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { newBatchCall } = useBatchCall();
  const { getPayeeItems } = usePayeeConfig();
  const { accountHasSigner } = useImportedAccounts();
  const { activeAccount, activeProxy } = useActiveAccounts();
  const { getSetupProgress, removeSetupProgress } = useSetup();

  const setup = getSetupProgress('nominator', activeAccount);
  const { progress } = setup;
  const { bond, nominations, payee } = progress;

  const getTxs = () => {
    if (!activeAccount || !api) {
      return null;
    }

    const targetsToSubmit = nominations.map((item: any) => ({
      Id: item.address,
    }));

    const payeeToSubmit =
      payee.destination === 'Account'
        ? {
            Account: payee.account,
          }
        : payee.destination;

    const bondToSubmit = unitToPlanck(bond, units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();

    const txs = [
      api.tx.staking.bond(bondAsString, payeeToSubmit),
      api.tx.staking.nominate(targetsToSubmit),
    ];
    return newBatchCall(txs, activeAccount);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTxs(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {},
    callbackInBlock: () => {
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
              {new BigNumber(bond).toFormat()} {unit}
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
