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

export const StakingInterface = () => {

  const { getBondedAccount }: any = useBalances();
  const { activeAccount } = useConnect();

  const controller = getBondedAccount(activeAccount);

  return (
    <SectionWrapper>
      <Separator padding />
      {controller === null &&
        <>
          <h1>Staking Setup</h1>
          <Separator padding />
          <Separator padding />
          <Controller />
          <Separator />
        </>
      }
      <Bond />
      {controller === null
        ? <Separator />
        : <Separator padding />
      }

      {controller === null
        ? <GenerateNominations />
        : <Nominations />
      }
    </SectionWrapper>
  )
}

export default StakingInterface;