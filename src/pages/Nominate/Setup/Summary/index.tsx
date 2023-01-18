// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { defaultStakeSetup } from 'contexts/Setup/defaults';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { SetupStepProps } from 'library/SetupSteps/types';
import { useTranslation } from 'react-i18next';
import { unitToPlanck } from 'Utils';
import { SummaryWrapper } from './Wrapper';

export const Summary = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages');
  const { api, network } = useApi();
  const { units } = network;
  const { activeAccount, accountHasSigner } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const { txFeesValid } = useTxFees();

  const setup = getSetupProgress('stake', activeAccount);

  const { controller, bond, nominations, payee } = setup;

  const getTxs = () => {
    if (!activeAccount || !api) {
      return null;
    }

    const targetsToSubmit = nominations.map((item: any) => {
      return {
        Id: item.address,
      };
    });

    const stashToSubmit = {
      Id: activeAccount,
    };

    const controllerToSubmit = {
      Id: controller,
    };

    const bondToSubmit = unitToPlanck(bond, units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();

    const txs = [
      api.tx.staking.bond(stashToSubmit, bondAsString, payee),
      api.tx.staking.nominate(targetsToSubmit),
      api.tx.staking.setController(controllerToSubmit),
    ];
    return api.tx.utility.batch(txs);
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTxs(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {},
    callbackInBlock: () => {
      // reset localStorage setup progress
      setActiveAccountSetup('stake', defaultStakeSetup);
    },
  });

  return (
    <>
      <Header
        thisSection={section}
        complete={null}
        title={t('nominate.summary') || ''}
        setupType="stake"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {!accountHasSigner(activeAccount) && (
          <Warning text={t('nominate.readOnly')} />
        )}
        <SummaryWrapper>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; Controller:
            </div>
            <div>{controller}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; {t('nominate.rewardDestination')}:
            </div>
            <div>{payee}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; {t('nominate.nominate')}:
            </div>
            <div>{nominations.length}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; {t('nominate.bondAmount')}:
            </div>
            <div>
              {new BigNumber(bond).toFormat()} {network.unit}
            </div>
          </section>
          <section>
            <EstimatedTxFee format="table" />
          </section>
        </SummaryWrapper>
        <div
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <ButtonPrimary
            lg
            onClick={() => submitTx()}
            disabled={
              submitting || !accountHasSigner(activeAccount) || !txFeesValid
            }
            text={t('nominate.startNominating')}
          />
        </div>
      </MotionContainer>
    </>
  );
};

export default Summary;
