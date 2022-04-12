// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StatusButton } from '../../../library/StatusButton';
import { StickyWrapper } from '../../../library/Layout';
import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { Button } from '../../../library/Button';
import { Link } from 'react-scroll'
import { useStaking } from '../../../contexts/Staking';
import { StyledHeader } from './Wrapper';
import NumberEasing from 'che-react-number-easing';

export const Progress = (props: any) => {

  // TODO: replace with setup form state
  const { isBonding, isNominating } = useStaking();

  const { stickyTitle, setup } = props;

  // fixed offset
  let offset = -55;
  if (stickyTitle) {
    offset -= 60;
  } else {
    offset -= 15;
  }

  // progress
  let progress = 0;
  if (setup.controller !== null) progress += 33;
  if (setup.bond !== 0) progress += 33;

  return (
    <StickyWrapper>
      <SectionWrapper transparent style={{ padding: '1rem' }}>
        <StyledHeader>
          <div><h3>Setup Progress</h3></div>
          <div>
            <NumberEasing
              ease="quintInOut"
              precision={2}
              speed={500}
              trail={false}
              value={progress}
              useLocaleString={true}
            />
            %
          </div>
        </StyledHeader>

        <div style={{ width: '100%', marginTop: '1rem' }}>
          <Link to="controller" smooth={true} spy={true} duration={350} offset={offset}>
            <StatusButton checked={setup.controller ?? false} label='Set controller account' />
          </Link>

          <Link to="bond" smooth={true} duration={350} offset={offset}>
            <StatusButton checked={isBonding()} label='Set amount to Bond' />
          </Link>

          <Link to="nominate" smooth={true} duration={350} offset={offset}>
            <StatusButton checked={isNominating()} label='Select nominations' />
          </Link>
          <div style={{ width: '100%', height: '40px', display: 'flex' }}>
            <Button title='Start Staking' primary inline />
          </div>
        </div>
      </SectionWrapper>
    </StickyWrapper >
  )
}

export default Progress;