// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { SectionWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { useUi } from 'contexts/UI';
import { useConnect } from 'contexts/Connect';
import { Wrapper as ButtonWrapper } from 'library/Button';
import { humanNumber } from 'Utils';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { APIContextInterface } from 'types/api';
import { SummaryWrapper } from './Wrapper';
import { MotionContainer } from '../MotionContainer';
import { Header } from '../Header';

export const Summary = (props: any) => {
  const { section } = props;

  const { api, network } = useApi() as APIContextInterface;
  const { units } = network;
  const { activeAccount, activeExtension } = useConnect();
  const { getSetupProgress } = useUi();
  const setup = getSetupProgress(activeAccount);

  const { controller, bond, nominations, payee } = setup;

  const txs = () => {
    if (activeAccount === '' || activeExtension === null || !api) {
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
    const _txs = [
      api.tx.staking.bond(stashToSubmit, bondToSubmit, payee),
      api.tx.staking.nominate(targetsToSubmit),
      api.tx.staking.setController(controllerToSubmit),
    ];
    return api.tx.utility.batch(_txs);
  };

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: txs(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {},
    callbackInBlock: () => {},
  });

  return (
    <SectionWrapper transparent>
      <Header thisSection={section} complete={null} title="Summary" />
      <MotionContainer thisSection={section} activeSection={setup.section}>
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
              &nbsp; Reward Destination:
            </div>
            <div>{payee}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; Nominations:
            </div>
            <div>{nominations.length}</div>
          </section>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; Bond Amount:
            </div>
            <div>
              {humanNumber(bond)} {network.unit}
            </div>
          </section>
          <section>
            <div>Estimated Tx Fee:</div>
            <div>{estimatedFee === null ? '...' : `${estimatedFee}`}</div>
          </section>
        </SummaryWrapper>
        <div style={{ flex: 1, width: '100%', display: 'flex' }}>
          <ButtonWrapper
            margin="0"
            padding="0.75rem 1.2rem"
            fontSize="1.1rem"
            onClick={() => submitTx()}
            disabled={submitting}
          >
            Start Staking
          </ButtonWrapper>
        </div>
      </MotionContainer>
    </SectionWrapper>
  );
};

export default Summary;
