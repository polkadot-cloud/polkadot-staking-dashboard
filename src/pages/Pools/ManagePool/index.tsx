// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { usePools } from 'contexts/Pools';
import { useModal } from 'contexts/Modal';
import { PageRowWrapper } from '../../../Wrappers';
import {
  SectionWrapper,
  SectionHeaderWrapper,
} from '../../../library/Graphs/Wrappers';
import { OpenAssistantIcon } from '../../../library/OpenAssistantIcon';
import { Roles } from './Roles';
import { GenerateNominations } from '../../Stake/GenerateNominations';
import { Nominations } from '../../Stake/Active/Nominations';
import { Button } from '../../../library/Button';
import { ManageWrapper } from './Wrappers';

export const ManagePool = () => {
  const { isNominator, membership, setTargets, targets } = usePools();
  const { openModalWith } = useModal();
  return (
    <PageRowWrapper className="page-padding" noVerticalSpacer>
      <SectionWrapper>
        <ManageWrapper>
          <div>
            <Roles />
          </div>
          <div>
            {isNominator() ? (
              <>
                <SectionHeaderWrapper withAction>
                  <h3>
                    Generate Nominations
                    <OpenAssistantIcon page="stake" title="Nominations" />
                  </h3>
                  <div>
                    <Button
                      small
                      inline
                      primary
                      title="Nominate"
                      disabled={!isNominator()}
                      onClick={() => openModalWith('NominatePool', {}, 'small')}
                    />
                  </div>
                </SectionHeaderWrapper>
                <GenerateNominations
                  batchKey="generate_pool_nominations"
                  nominations={targets.nominations}
                  setters={[
                    {
                      set: setTargets,
                      current: targets,
                    },
                  ]}
                />
              </>
            ) : (
              <Nominations />
            )}
          </div>
        </ManageWrapper>
      </SectionWrapper>
    </PageRowWrapper>
  );
};

export default ManagePool;
