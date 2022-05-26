// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { planckBnToUnit } from '../../Utils';
import BondedGraph from '../../library/Graphs/Bonded';
import { useApi } from '../../contexts/Api';
import { useStaking } from '../../contexts/Staking';
import { Button, ButtonRow } from '../../library/Button';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { useUi } from '../../contexts/UI';
import { usePools } from '../../contexts/Pools';
import { SectionHeaderWrapper } from '../../library/Graphs/Wrappers';
import { APIContextInterface } from '../../types/api';

export const ManageBond = () => {
  const { network } = useApi() as APIContextInterface;
  const { units } = network;
  const { inSetup } = useStaking();
  const { isSyncing } = useUi();
  const { membership } = usePools();

  // TODO: hook up to live data
  const totalUnlockChuncks = 0;
  const active = new BN(0);
  const totalUnlocking = 0;
  const freeToBond = 0;
  const total = new BN(0);

  return (
    <>
      <SectionHeaderWrapper>
        <h4>
          Bonded Funds
          <OpenAssistantIcon page="pools" title="Bonded in Pool" />
        </h4>
        <h2>
          {planckBnToUnit(active, units)}&nbsp;{network.unit}
        </h2>
        <ButtonRow>
          <Button
            small
            primary
            inline
            title="+"
            disabled={!membership}
            onClick={() => console.log('TODO: Add Funds To Pool')}
          />
          <Button
            small
            primary
            title="-"
            disabled={!membership}
            onClick={() => console.log('TODO: Remove Funds To Pool')}
          />
          <Button
            small
            inline
            primary
            icon={faLockOpen}
            title={String(totalUnlockChuncks ?? 0)}
            disabled={!membership}
            onClick={() => console.log('TODO: Manage Pool Unlocks')}
          />
        </ButtonRow>
      </SectionHeaderWrapper>
      <BondedGraph
        active={planckBnToUnit(active, units)}
        unlocking={totalUnlocking}
        free={freeToBond}
        total={total.toNumber()}
        inactive={inSetup()}
      />
    </>
  );
};

export default ManageBond;
