// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clipAddress, unitToPlanck } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { Warning } from 'library/Form/Warning';
import { useBatchCall } from 'library/Hooks/useBatchCall';
import { usePayeeConfig } from 'library/Hooks/usePayeeConfig';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import type { SetupStepProps } from 'library/SetupSteps/types';
import { SubmitTx } from 'library/SubmitTx';
import { useTranslation } from 'react-i18next';
import { SummaryWrapper } from './Wrapper';

export const Summary = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages');
  const {
    api,
    network: { units, unit, name },
  } = useApi();
  const { newBatchCall } = useBatchCall();
  const { getPayeeItems } = usePayeeConfig();
  const { getSetupProgress, removeSetupProgress } = useSetup();
  const { activeAccount, activeProxy, accountHasSigner } = useConnect();

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

    const controllerToSubmit = {
      Id: activeAccount,
    };

    const payeeToSubmit =
      payee.destination === 'Account'
        ? {
            Account: payee.account,
          }
        : payee.destination;

    const bondToSubmit = unitToPlanck(bond, units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();

    const txs = [
      ['westend', 'kusama'].includes(name)
        ? api.tx.staking.bond(bondAsString, payeeToSubmit)
        : api.tx.staking.bond(controllerToSubmit, bondAsString, payeeToSubmit),
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
        title={`${t('nominate.summary')}`}
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
                ? `${payeeDisplay}: ${clipAddress(payee.account)}`
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
            submitText={`${t('nominate.startNominating')}`}
            valid
            noMargin
            customEvent={`${name.toLowerCase()}_user_started_nominating`}
            {...submitExtrinsic}
          />
        </div>
      </MotionContainer>
    </>
  );
};
