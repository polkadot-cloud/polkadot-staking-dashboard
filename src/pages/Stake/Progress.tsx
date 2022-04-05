// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ProgressButton } from './Wrappers';
import { StickyWrapper } from '../../library/Layout';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { Button } from '../../library/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-scroll'
import { useStaking } from '../../contexts/Staking';

export const Progress = () => {

  // TODO: replace with setup form state
  const { hasController, isBonding, isNominating } = useStaking();

  return (
    <StickyWrapper>
      <SectionWrapper>
        <h3>Progress</h3>

        <div style={{ width: '100%', marginTop: '1.5rem' }}>
          <Link to="controller" smooth={true} duration={350} offset={-95}>
            <ProgressButton>
              <section>
                <FontAwesomeIcon color="#ccc" transform='grow-1' icon={hasController() ? faCheckCircle : faCircle} />
              </section>
              <section>Set controller account</section>
            </ProgressButton>
          </Link>

          <Link to="bond" smooth={true} duration={350} offset={-95}>
            <ProgressButton>
              <section>
                <FontAwesomeIcon color="#ccc" transform='grow-1' icon={isBonding() ? faCheckCircle : faCircle} />
              </section>
              <section>Set amount to Bond</section>
            </ProgressButton>
          </Link>

          <Link to="nominate" smooth={true} duration={350} offset={-95}>
            <ProgressButton>
              <section>
                <FontAwesomeIcon color="#ccc" transform='grow-1' icon={isNominating() ? faCheckCircle : faCircle} />
              </section>
              <section>Select nominations</section>
            </ProgressButton>
          </Link>
          <div style={{ width: '100%', height: '40px', display: 'flex' }}><Button title='Start Staking' primary inline /></div>
        </div>
      </SectionWrapper>
    </StickyWrapper>
  )
}

export default Progress;