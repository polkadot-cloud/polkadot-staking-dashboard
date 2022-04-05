// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StatusButton } from '../../library/StatusButton';
import { StickyWrapper } from '../../library/Layout';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { Button } from '../../library/Button';
import { Link } from 'react-scroll'
import { useStaking } from '../../contexts/Staking';

export const Progress = (props: any) => {

  // TODO: replace with setup form state
  const { hasController, isBonding, isNominating } = useStaking();

  const { stickyTitle } = props;

  let offset = -55;
  if (stickyTitle) {
    offset -= 60;
  } else {
    offset -= 15;
  }

  return (
    <StickyWrapper>
      <SectionWrapper>
        <h3>Progress</h3>

        <div style={{ width: '100%', marginTop: '1.5rem' }}>
          <Link to="controller" smooth={true} spy={true} duration={350} offset={offset}>
            <StatusButton checked={hasController()} label='Set controller account' />
          </Link>

          <Link to="bond" smooth={true} duration={350} offset={offset}>
            <StatusButton checked={isBonding()} label='Set amount to Bond' />
          </Link>

          <Link to="nominate" smooth={true} duration={350} offset={offset}>
            <StatusButton checked={isNominating()} label='Select nominations' />
          </Link>
          <div style={{ width: '100%', height: '40px', display: 'flex' }}><Button title='Start Staking' primary inline /></div>
        </div>
      </SectionWrapper>
    </StickyWrapper>
  )
}

export default Progress;