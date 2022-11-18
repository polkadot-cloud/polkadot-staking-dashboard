// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useTxFees } from 'contexts/TxFees';
import { useUi } from 'contexts/UI';
import { defaultStakeSetup } from 'contexts/UI/defaults';
import { SetupType } from 'contexts/UI/types';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { SetupStepProps } from 'library/SetupSteps/types';
import { useTranslation } from 'react-i18next';
import { humanNumber } from 'Utils';
import { SummaryWrapper } from './Wrapper';

export const Summary = (props: SetupStepProps) => {
  const { section } = props;
  const { t } = useTranslation('common');

  const { api, network } = useApi();
  const { units } = network;
  const { activeAccount, accountHasSigner } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const { txFeesValid } = useTxFees();

  const setup = getSetupProgress(SetupType.Stake, activeAccount);

  const { controller, bond, nominations, payee } = setup;

  const getTxs = () => {
    if (!activeAccount || !api) {
      return null;
    }
    const stashToSubmit = {
      Id: activeAccount,
    };
    const bondToSubmit = bond * 10 ** units;
    const targetsToSubmit = nominations.map((item: any) => {
      return {
        Id: item.address,
      };
    });
    const controllerToSubmit = {
      Id: controller,
    };

    // construct a batch of transactions
    const txs = [
      api.tx.staking.bond(stashToSubmit, bondToSubmit, payee),
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
      setActiveAccountSetup(SetupType.Stake, defaultStakeSetup);
    },
  });

  return (
    <>
      <Header
        thisSection={section}
        complete={null}
        title={t('pages.nominate.summary') || ''}
        setupType={SetupType.Stake}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {!accountHasSigner(activeAccount) && (
          <Warning text={t('pages.nominate.w1')} />
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
              &nbsp; {t('pages.nominate.reward_destination')}
            </div>
            <div>{payee}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; {t('pages.nominate.nominations')}
            </div>
            <div>{nominations.length}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; {t('pages.nominate.bond_amount')}
            </div>
            <div>
              {humanNumber(bond)} {network.unit}
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
            text={t('pages.nominate.start_nominating')}
          />
        </div>
      </MotionContainer>
    </>
  );
};

export default Summary;
