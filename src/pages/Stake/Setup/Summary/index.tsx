// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
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
import { web3FromAddress } from '@polkadot/extension-dapp';

export const Summary = (props: any) => {

  const { section } = props;

  const { api, network }: any = useApi();
  const { units } = network;
  const { activeAccount } = useConnect();
  const { getSetupProgress } = useUi();
  const setup = getSetupProgress(activeAccount);
  const { addNotification } = useNotifications();
  const { addPending, removePending } = useExtrinsics();

  const { controller, bond, nominations, payee } = setup;

  // whether the transaction is in progress
  const [submitting, setSubmitting] = useState(false);

  // get the estimated fee for submitting the transaction
  const [estimatedFee, setEstimatedFee] = useState(null);

  // calculate fee upon setup changes and initial render
  useEffect(() => {
    calculateEstimatedFee();
  }, []);

  useEffect(() => {
    // only update fee if successfully land on Summary
    if (setup.section === 5) {
      calculateEstimatedFee();
    }
  }, [setup]);

  const txs = () => {

    // format metadata to submit
    let stashToSubmit = {
      Id: activeAccount
    };
    let bondToSubmit = bond * (10 ** units);
    let targetsToSubmit = nominations.map((item: any,) => {
      return ({
        Id: item.address
      });
    });
    let controllerToSubmit = {
      Id: controller
    };

    // construct a batch of transactions 
    const txs = [
      api.tx.staking.bond(stashToSubmit, bondToSubmit, payee),
      api.tx.staking.nominate(targetsToSubmit),
      api.tx.staking.setController(controllerToSubmit)
    ];
    return txs;
  }

  const calculateEstimatedFee = async () => {

    // get payment info
    const info = await api.tx.utility
      .batch(txs())
      .paymentInfo(activeAccount);

    // convert fee to unit
    setEstimatedFee(info.partialFee.toHuman());
  }

  // submit transaction
  const submitTx = async () => {

    const accountNonce = await api.rpc.system.accountNextIndex(activeAccount);
    const injector = await web3FromAddress(activeAccount);

    // pre-submission state update
    setSubmitting(true);
    addPending(accountNonce);
    addNotification({
      title: 'Transaction Submitted',
      subtitle: 'Initiating staking setup.',
    });

    try {
      // construct the batch and send the transactions
      const unsub = await api.tx.utility
        .batch(txs())
        .signAndSend(activeAccount, { signer: injector.signer }, ({ status, nonce: accountNonce, events = [] }: any) => {
          if (status.isFinalized) {
            // loop through events to determine success or fail
            events.forEach(({ phase, event: { data, method, section } }: any) => {

              if (method === 'ExtrinsicSuccess') {
                addNotification({
                  title: 'Transaction Successful',
                  subtitle: 'Staking setup successful',
                });
              }
              else if (method === 'ExtrinsicFailed') {
                addNotification({
                  title: 'Transaction Failed',
                  subtitle: 'Staking setup failed',
                });
              }
            });
            // post-submission state update.
            setSubmitting(false);
            removePending(accountNonce);
            unsub();
          }
        });
    } catch (e) {
      setSubmitting(false);
      removePending(accountNonce);
      addNotification({
        title: 'Transaction Cancelled',
        subtitle: 'Staking setup was cancelled',
      });
    }
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
          <section>
            <div>Estimated Tx Fee:</div>
            <div>
              {estimatedFee === null ? '...' : `${estimatedFee}`}
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