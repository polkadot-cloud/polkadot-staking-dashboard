// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Separator } from './Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { Nominations } from './Nominations';
import { ChooseNominators } from './ChooseNominators';
import { useStaking } from '../../contexts/Staking';
import { SetController } from './SetController';
import { Bond } from './Bond';
import { Element } from 'react-scroll';

export const StakingInterface = () => {

  const { hasController, isNominating } = useStaking();

  return (
    <>
      {!hasController() &&
        <SectionWrapper>
          <Separator padding />
          <Element name="controller" style={{ position: 'absolute' }} />
          <SetController />
          <Separator />
        </SectionWrapper>
      }
      <SectionWrapper>
        <Element name="bond" style={{ position: 'absolute' }} />
        <Bond />
      </SectionWrapper>

      <SectionWrapper>
        <Element name="nominate" style={{ position: 'absolute' }} />
        {!isNominating()
          ? <ChooseNominators />
          : <Nominations />
        }
      </SectionWrapper>
    </>
  )
}

export default StakingInterface;