// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useApi } from 'contexts/Api';
import { useUi } from 'contexts/UI';
import { useConnect } from 'contexts/Connect';
import { Button } from 'library/Button';
import { humanNumber } from 'Utils';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Warning } from 'library/Form/Warning';
import { SetupStepProps } from 'library/SetupSteps/types';
import { SetupType } from 'contexts/UI/types';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { SummaryWrapper } from './Wrapper';

export const Summary = (props: SetupStepProps) => {
  const { section } = props;

  const { api, network } = useApi();
  const { units } = network;
  const { activeAccount, accountHasSigner } = useConnect();
  const { getSetupProgress } = useUi();
  const setup = getSetupProgress(SetupType.Pool, activeAccount);

  const { metadata, bond, roles, nominations } = setup;

  const txs = () => {
    if (
      !activeAccount ||
      !api ||
      !metadata ||
      bond === 0 ||
      !roles ||
      !nominations.length
    ) {
      return null;
    }
    const bondToSubmit = bond * 10 ** units;

    // // construct a batch of transactions
    const _txs = [
      api.tx.nominationPools.create(
        bondToSubmit,
        roles.root,
        roles.nominator,
        roles.stateToggler
      ),
    ];
    return api.tx.utility.batch(_txs);
  };

  const { submitTx, estimatedFee, submitting } = useSubmitExtrinsic({
    tx: txs(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {},
    callbackInBlock: () => {},
  });

  return (
    <>
      <Header
        thisSection={section}
        complete={null}
        title="Summary"
        setupType={SetupType.Pool}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {!accountHasSigner(activeAccount) && (
          <Warning text="Your account is read only, and cannot sign transactions." />
        )}
        <SummaryWrapper>
          <section>
            <div>
              <FontAwesomeIcon
                icon={faCheckCircle as IconProp}
                transform="grow-1"
              />{' '}
              &nbsp; Pool Name:
            </div>
            <div>{metadata ?? `Not Set`}</div>
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
              &nbsp; Roles:
            </div>
            <div>Assigned</div>
          </section>
          <section>
            <div>Estimated Tx Fee:</div>
            <div>{estimatedFee === null ? '...' : `${estimatedFee}`}</div>
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
          <Button
            onClick={() => submitTx()}
            disabled={submitting || !accountHasSigner(activeAccount)}
            title="Create Pool"
            primary
          />
        </div>
      </MotionContainer>
    </>
  );
};

export default Summary;
