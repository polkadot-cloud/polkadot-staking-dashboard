// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { Wrapper, ContentWrapper, SectionsWrapper, FixedContentWrapper } from './Wrapper';
import { HeadingWrapper, FooterWrapper } from '../Wrappers';
import { useModal } from '../../contexts/Modal';
import { useApi } from '../../contexts/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';

export const UpdateBond = () => {

  const { network }: any = useApi();
  const { config }: any = useModal();
  const { fn } = config;

  const [section, setSection] = useState(0);

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
                <button onClick={() => {
                  setSection(1);
                }}>
                  <div>
                    <h3>Bond Extra</h3>
                    <p>Bond more {network.unit}.</p>
                  </div>
                  <div>
                    <FontAwesomeIcon transform='shrink-2' icon={faChevronRight} />
                  </div>
                </button>
                <button onClick={() => {
                  setSection(1);
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
                <button onClick={() => {
                  setSection(1);
                }}>
                  <div>
                    <h3>Unbond</h3>
                    <p>Unbond some of your {network.unit}.</p>
                  </div>
                  <div>
                    <FontAwesomeIcon transform='shrink-2' icon={faChevronRight} />
                  </div>
                </button>
                <button onClick={() => {
                  setSection(1);
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