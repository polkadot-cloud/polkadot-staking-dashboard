// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { SectionWrapper } from '../../../../library/Graphs/Wrappers';
import { Header } from '../Header';
import { MotionContainer } from '../MotionContainer';
import { useApi } from '../../../../contexts/Api';
import { useUi } from '../../../../contexts/UI';
import { useConnect } from '../../../../contexts/Connect';
import { Wrapper as ButtonWrapper } from '../../../../library/Button';
import { SummaryWrapper } from './Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { useNotifications } from '../../../../contexts/Notifications';
import { useExtrinsics } from '../../../../contexts/Extrinsics';
import { humanNumber } from '../../../../Utils';

export const Summary = (props: any) => {

  const { section } = props;

  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { getSetupProgress } = useUi();
  const setup = getSetupProgress(activeAccount);
  const { addNotification } = useNotifications();
  const { addPending, removePending } = useExtrinsics();

  const [submitting, setSubmitting] = useState(false);

  const { controller, bond, nominations, payee } = setup;

  // transaction dummy
  const submitTx = () => {

    // tx object
    let tx = {
      name: 'set_controller'
    };

    setSubmitting(true);

    // add to pending transactions context
    addPending(tx);

    // trigger pending tx notification
    addNotification({
      title: 'Transaction Submitted',
      subtitle: 'Initiating staking setup.',
    });

    // complete transaction after 2 seconds
    setTimeout(() => {

      // callback state updates

      setSubmitting(false);

      // remove pending extrinsic
      removePending(tx);

      // trigger completed tx notification
      addNotification({
        title: 'Transaction Successful',
        subtitle: 'Staking setup successful',
      });
    }, 2000);
  }

  return (
    <SectionWrapper transparent>
      <Header
        thisSection={section}
        complete={null}
        title='Summary'
      />
      <MotionContainer
        thisSection={section}
        activeSection={setup.section}
      >
        <SummaryWrapper>
          <section>
            <div><FontAwesomeIcon icon={faCheckCircle} transform='grow-1' /> &nbsp; Controller:</div>
            <div>
              {controller}
            </div>
          </section>
          <section>
            <div><FontAwesomeIcon icon={faCheckCircle} transform='grow-1' /> &nbsp; Reward Destination:</div>
            <div>
              {payee}
            </div>
          </section>
          <section>
            <div><FontAwesomeIcon icon={faCheckCircle} transform='grow-1' /> &nbsp; Nominations:</div>
            <div>
              {nominations.length}
            </div>
          </section>
          <section>
            <div><FontAwesomeIcon icon={faCheckCircle} transform='grow-1' /> &nbsp; Bond Amount:</div>
            <div>
              {humanNumber(bond)} {network.unit}
            </div>
          </section>
        </SummaryWrapper>
        <div style={{ flex: 1, width: '100%', display: 'flex' }}>
          <ButtonWrapper
            margin={'0'}
            padding={'0.75rem 1.2rem'}
            fontSize='1.1rem'
            onClick={() => submitTx()}
            disabled={submitting}
          >
            Start Staking
          </ButtonWrapper>
        </div>
      </MotionContainer>
    </SectionWrapper>
  )
}

export default Summary;