// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StatusButton } from '../../../library/StatusButton';
import { StickyWrapper } from '../../../library/Layout';
import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { Link } from 'react-scroll'
import { useStaking } from '../../../contexts/Staking';
import NumberEasing from 'che-react-number-easing';
import { PageRowWrapper } from '../../../Wrappers';

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
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper transparent>
          <div style={{ width: '100%', marginTop: '1rem', display: 'flex', flexFlow: 'row wrap', }}>
            <Link to="controller" smooth={true} spy={true} duration={350} offset={offset} style={{ flex: 1 }}>
              <StatusButton checked={setup.controller ?? false} label='Set controller account' />
            </Link>

            <Link to="bond" smooth={true} duration={350} offset={offset} style={{ flex: 1 }}>
              <StatusButton checked={isBonding()} label='Set amount to Bond' />
            </Link>

            <Link to="nominate" smooth={true} duration={350} offset={offset} style={{ flex: 1 }}>
              <StatusButton checked={isNominating()} label='Select nominations' />
            </Link>

            <div style={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', height: '3rem' }}>
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
          </div>
        </SectionWrapper>
      </PageRowWrapper>
    </StickyWrapper>
  )
}

export default Progress;