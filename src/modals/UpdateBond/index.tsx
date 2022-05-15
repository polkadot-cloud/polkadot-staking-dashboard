// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { Wrapper, ContentWrapper, SectionsWrapper, FixedContentWrapper, Separator } from './Wrapper';
import { HeadingWrapper, FooterWrapper } from '../Wrappers';
import { useModal } from '../../contexts/Modal';
import { useBalances } from '../../contexts/Balances';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { BondInputWithFeedback } from '../../library/Form/BondInputWithFeedback';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useNotifications } from '../../contexts/Notifications';
import { useExtrinsics } from '../../contexts/Extrinsics';

export const UpdateBond = () => {

  const { api, network }: any = useApi();
  const { config, setStatus: setModalStatus }: any = useModal();
  const { activeAccount } = useConnect();
  const { getBondOptions, getBondedAccount }: any = useBalances();
  const { fn } = config;
  const {
    freeToBond,
    freeToUnbond,
    totalPossibleBond
  } = getBondOptions(activeAccount);
  const controller = getBondedAccount(activeAccount);
  const { addNotification } = useNotifications();
  const { addPending, removePending } = useExtrinsics();

  const { units } = network;

  // task - whether to bond or unbond
  const [task, setTask]: any = useState(null);

  // active section of modal
  const [section, setSection] = useState(0);

  // set local bond value
  const [bond, setBond] = useState(freeToBond);

  // update bond value on task change
  useEffect(() => {
    let _bond = (task === 'bond_some' || task === 'bond_all')
      ? freeToBond
      : freeToUnbond;
    setBond({
      bond: _bond
    });
  }, [task]);

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  // whether the transaction is in progress
  const [submitting, setSubmitting] = useState(false);

  // get the estimated fee for submitting the transaction
  const [estimatedFee, setEstimatedFee] = useState(null);

  // calculate fee upon setup changes and initial render
  useEffect(() => {
    calculateEstimatedFee();
  }, [bond]);

  const calculateEstimatedFee = async () => {
    if (task === null) {
      return;
    }
    // get payment info
    const info = await tx()
      .paymentInfo(activeAccount);
    // convert fee to unit
    setEstimatedFee(info.partialFee.toHuman());
  }

  // extrinsic to submit
  const tx = () => {
    let tx;
    let bondToSubmit = bond.bond * (10 ** units);
    if (task === 'bond_some' || task === 'bond_all') {
      tx =
        api.tx.staking.bondExtra(bondToSubmit);
    } else if (task === 'unbond_some' || task === 'unbond_all') {
      tx =
        api.tx.staking.unbond(bondToSubmit);
    }
    return tx;
  }

  // submit extrinsic
  const submitTx = async () => {
    if (!bondValid || submitting) {
      return;
    }
    const accountNonce = await api.rpc.system.accountNextIndex(activeAccount);
    const injector = await web3FromAddress(activeAccount);

    // pre-submission state update
    setSubmitting(true);
    addPending(accountNonce);
    addNotification({
      title: 'Transaction Submitted',
      subtitle: 'Bonding transaction was initiated.',
    });
    setModalStatus(0);

    try {
      const _tx = tx();
      const unsub = await _tx
        .signAndSend(activeAccount, { signer: injector.signer }, ({ status, nonce, events = [] }: any) => {
          if (status.isInBlock) {
            setSubmitting(false);
            removePending(accountNonce);
            addNotification({
              title: 'Transaction In Block',
              subtitle: 'Bonding transaction in block',
            });
          }
          if (status.isFinalized) {
            // loop through events to determine success or fail
            events.forEach(({ phase, event: { data, method, section } }: any) => {

              if (method === 'ExtrinsicSuccess') {
                addNotification({
                  title: 'Transaction Finalized',
                  subtitle: 'Bonding transaction successful',
                });
                unsub();
              }
              else if (method === 'ExtrinsicFailed') {
                addNotification({
                  title: 'Transaction Failed',
                  subtitle: 'Bonding transaction failed',
                });
                setSubmitting(false);
                removePending(accountNonce);
                unsub();
              }
            });
          }
        });
    } catch (e) {
      setSubmitting(false);
      removePending(accountNonce);
      addNotification({
        title: 'Transaction Cancelled',
        subtitle: 'Bonding transaction was cancelled',
      });
    }
  }

  return (
    <Wrapper>
      <FixedContentWrapper>
        <HeadingWrapper>
          <FontAwesomeIcon transform='grow-2' icon={fn === 'add' ? faPlus : faMinus} />
          {fn == 'add' ? 'Add To' : 'Remove'} Bond
        </HeadingWrapper>
      </FixedContentWrapper>
      <SectionsWrapper
        animate={section === 0 ? `home` : `next`}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0.22
        }}
        variants={{
          home: {
            left: 0,
          },
          next: {
            left: '-100%',
          },
        }}
      >
        <ContentWrapper>
          <div className='items'>
            {fn === 'add' &&
              <>
                <button
                  className='action-button'
                  onClick={() => {
                    setSection(1);
                    setTask('bond_some');
                  }}>
                  <div>
                    <h3>Bond Extra</h3>
                    <p>Bond more {network.unit}.</p>
                  </div>
                  <div>
                    <FontAwesomeIcon transform='shrink-2' icon={faChevronRight} />
                  </div>
                </button>
                <button
                  className='action-button'
                  onClick={() => {
                    setSection(1);
                    setTask('bond_all');
                  }}>
                  <div>
                    <h3>Bond All</h3>
                    <p>Bond all available {network.unit}.</p>
                  </div>
                  <div>
                    <FontAwesomeIcon transform='shrink-2' icon={faChevronRight} />
                  </div>
                </button>
              </>
            }
            {fn === 'remove' &&
              <>
                <button
                  className='action-button'
                  onClick={() => {
                    setSection(1);
                    setTask('unbond_some');
                  }}>
                  <div>
                    <h3>Unbond</h3>
                    <p>Unbond some of your {network.unit}.</p>
                  </div>
                  <div>
                    <FontAwesomeIcon transform='shrink-2' icon={faChevronRight} />
                  </div>
                </button>
                <button
                  className='action-button'
                  onClick={() => {
                    setSection(1);
                    setTask('unbond_all');
                  }}>
                  <div>
                    <h3>Unbond All</h3>
                    <p>Exit your staking position.</p>
                  </div>
                  <div>
                    <FontAwesomeIcon transform='shrink-2' icon={faChevronRight} />
                  </div>
                </button>
              </>
            }
          </div>
        </ContentWrapper>
        <ContentWrapper>
          <div className='items'>
            {task === 'bond_some' &&
              <>
                <BondInputWithFeedback
                  unbond={false}
                  listenIsValid={setBondValid}
                  defaultBond={freeToBond}
                  setters={[{
                    set: setBond,
                    current: bond
                  }]}
                />
              </>
            }
            {task === 'bond_all' &&
              <>
                <h4>Amount to bond:</h4>
                <h2>{freeToBond} {network.unit}</h2>
                <p>This amount of {network.unit} will be added to your current bonded funds.</p>
                <Separator />
                <h4>New total bond:</h4>
                <h2>{totalPossibleBond} {network.unit}</h2>
              </>
            }
            {task === 'unbond_some' &&
              <>
                <BondInputWithFeedback
                  unbond={true}
                  listenIsValid={setBondValid}
                  defaultBond={freeToUnbond}
                  setters={[{
                    set: setBond,
                    current: bond
                  }]}
                />
                <p>Once unbonding, you must wait 28 days for your funds to become available.</p>
              </>
            }
            {task === 'unbond_all' &&
              <>
                <h4>Amount to unbond:</h4>
                <h2>{freeToUnbond} {network.unit}</h2>
                <p>Once unbonding, you must wait 28 days for your funds to become available.</p>
              </>
            }
            <div>
              <p>Estimated Tx Fee: {estimatedFee === null ? '...' : `${estimatedFee}`}</p>
            </div>
          </div>
          <FooterWrapper>
            <div>
              <button
                className='submit'
                onClick={() => setSection(0)}
              >
                <FontAwesomeIcon transform='shrink-2' icon={faChevronLeft} />
                Back
              </button>
            </div>
            <div>
              <button className='submit' onClick={() => submitTx()} disabled={submitting || !bondValid}>
                <FontAwesomeIcon transform='grow-2' icon={faArrowAltCircleUp} />
                Submit{submitting && 'ting'}
              </button>
            </div>
          </FooterWrapper>
        </ContentWrapper>
      </SectionsWrapper>
    </Wrapper>
  )
}

export default UpdateBond;