// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { Wrapper, ContentWrapper, SectionsWrapper, FixedContentWrapper, Separator } from './Wrapper';
import { HeadingWrapper, FooterWrapper } from '../Wrappers';
import { useModal } from '../../contexts/Modal';
import { useBalances } from '../../contexts/Balances';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { planckToUnit } from '../../Utils';
import { RESERVE_AMOUNT_DOT } from '../../constants';
import { BondInputWithFeedback } from '../../library/Form/BondInputWithFeedback';

export const UpdateBond = () => {

  const { network }: any = useApi();
  const { units } = network;
  const { config }: any = useModal();
  const { activeAccount } = useConnect();
  const { getAccountBalance, getBondedAccount, getAccountLedger }: any = useBalances();
  const balance = getAccountBalance(activeAccount);
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { active } = ledger;
  const { freeAfterReserve } = balance;
  const { fn } = config;

  // active section of modal
  const [section, setSection] = useState(0);

  // task - whether to bond or unbond
  const [task, setTask]: any = useState(null);

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  // bond stats
  let freeToBond: any = planckToUnit(freeAfterReserve.toNumber(), units) - planckToUnit(active.toNumber(), units);
  freeToBond = freeToBond < 0 ? 0 : freeToBond;
  let totalPossibleBond = planckToUnit(active.toNumber(), units) + freeToBond;
  let unbondAllAmount = planckToUnit(active.toNumber(), units);

  // default value will either be available to bond, or total bonded
  let _bond = task === 'bond' ? freeToBond : planckToUnit(active.toNumber(), units);

  // set local bond value
  const [bond, setBond] = useState({
    bond: _bond
  });

  // TODO: submit extrinsic
  const submitTx = () => {
    if (!bondValid) {
      return;
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
                <p>Total amount available to bond after deducting a reserve amount of {RESERVE_AMOUNT_DOT} {network.unit}.</p>
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
                  defaultBond={unbondAllAmount}
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
                <h2>{unbondAllAmount} {network.unit}</h2>
                <p>Once unbonding, you must wait 28 days for your funds to become available.</p>
              </>
            }
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
              <button className='submit' onClick={() => submitTx()}>
                <FontAwesomeIcon transform='grow-2' icon={faArrowAltCircleUp} />
                Submit
              </button>
            </div>
          </FooterWrapper>
        </ContentWrapper>
      </SectionsWrapper>
    </Wrapper>
  )
}

export default UpdateBond;