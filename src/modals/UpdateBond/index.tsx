// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
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
import { planckToDot } from '../../Utils';
import { BondInput } from '../../library/Form/BondInput';
import { RESERVE_AMOUNT_DOT } from '../../constants';

export const UpdateBond = () => {

  const { network }: any = useApi();
  const { config }: any = useModal();
  const { activeAccount } = useConnect();
  const { getAccountBalance, getBondedAccount, getAccountLedger }: any = useBalances();
  const balance = getAccountBalance(activeAccount);
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { active } = ledger;
  const { free, miscFrozen } = balance;
  const { fn } = config;

  const [section, setSection] = useState(0);
  const [task, setTask]: any = useState(null);

  let availableToBond = planckToDot(free - miscFrozen);
  let totalPossibleBond = planckToDot(active + availableToBond);
  let unbondAllAmount = planckToDot(active);

  // TODO: submit extrinsic
  const submitTx = () => {
  }

  // section variants
  const sectionVariants = {
    home: {
      left: 0,
    },
    next: {
      left: '-100%',
    },
  };

  // animate assistant container default
  const animateSections = section === 0 ? `home` : `next`;

  return (
    <Wrapper>
      <FixedContentWrapper>
        <HeadingWrapper>
          <FontAwesomeIcon transform='grow-2' icon={fn === 'add' ? faPlus : faMinus} />
          {fn == 'add' ? 'Add To' : 'Remove'} Bond
        </HeadingWrapper>
      </FixedContentWrapper>
      <SectionsWrapper
        animate={animateSections}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0.22
        }}
        variants={sectionVariants}
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
                <BondInput
                  disabled={false}
                />
                <p>Total amount available to bond after deducting a reserve amount of {RESERVE_AMOUNT_DOT} {network.unit}.</p>
              </>
            }

            {task === 'bond_all' &&
              <>
                <h4>Amount to bond:</h4>
                <h2>{availableToBond} {network.unit}</h2>
                <p>This amount of {network.unit} will be added to your current bonded funds.</p>
                <Separator />
                <h4>New total bond:</h4>
                <h2>{totalPossibleBond} {network.unit}</h2>
              </>
            }

            {task === 'unbond_some' &&
              <>
                <BondInput
                  disabled={false}
                  task='unbond'
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