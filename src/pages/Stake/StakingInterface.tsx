// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Separator } from './Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { Nominations } from './Nominations';
import { GenerateNominations } from './GenerateNominations';
import { useBalances } from '../../contexts/Balances';
import { useConnect } from '../../contexts/Connect';
import { Controller } from './Controller';
import { Bond } from './Bond';
import { Element } from 'react-scroll'

export const StakingInterface = () => {

  const { getBondedAccount }: any = useBalances();
  const { activeAccount } = useConnect();

  const controller = getBondedAccount(activeAccount);

  return (
    <>
      {controller === null &&
        <SectionWrapper>
          <Separator padding />
          <Element name="controller" style={{ position: 'absolute' }} />
          <Controller />
          <Separator />
        </SectionWrapper>
      }
      <SectionWrapper>
        <Element name="bond" style={{ position: 'absolute' }} />
        <Bond />
      </SectionWrapper>

      <SectionWrapper>
        <Element name="nominate" style={{ position: 'absolute' }} />
        {controller === null
          ? <GenerateNominations />
          : <Nominations />
        }
      </SectionWrapper>
    </>
  )
}

export default StakingInterface;