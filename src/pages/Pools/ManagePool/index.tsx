// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { usePools } from 'contexts/Pools';
import { PageRowWrapper } from '../../../Wrappers';
import {
  SectionWrapper,
  SectionHeaderWrapper,
} from '../../../library/Graphs/Wrappers';
import { OpenAssistantIcon } from '../../../library/OpenAssistantIcon';
import { Roles } from './Roles';
import { GenerateNominations } from '../../Stake/GenerateNominations';
import { Button } from '../../../library/Button';
import { ManageWrapper } from './Wrappers';

export const ManagePool = () => {
  const [targets, setTargets] = useState({
    nominations: [],
  });

  const { isNominator, membership } = usePools();

  return (
    <PageRowWrapper className="page-padding" noVerticalSpacer>
      <SectionWrapper>
        <ManageWrapper>
          <div>
            <Roles />
          </div>
          <div>
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
                  onClick={() =>
                    console.log('TODO: Change nominations if Nominator role')
                  }
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
          </div>
        </ManageWrapper>
      </SectionWrapper>
    </PageRowWrapper>
  );
};

export default ManagePool;
