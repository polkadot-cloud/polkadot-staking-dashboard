// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { usePools } from 'contexts/Pools';
import { useModal } from 'contexts/Modal';
import { PageRowWrapper } from 'Wrappers';
import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { Button } from 'library/Button';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { PoolsContextState } from 'types/pools';
import { GenerateNominations } from '../../Stake/GenerateNominations';
import { PoolNominations } from '../PoolNominations';

export const ManagePool = () => {
  const { isNominator, setTargets, targets, poolNominations } =
    usePools() as PoolsContextState;
  const { openModalWith } = useModal();

  const isNominating = !!poolNominations?.targets?.length;

  return (
    <PageRowWrapper className="page-padding" noVerticalSpacer>
      <CardWrapper>
        {isNominator() && !isNominating ? (
          <>
            <CardHeaderWrapper withAction>
              <h3>
                Generate Nominations
                <OpenAssistantIcon page="stake" title="Nominations" />
              </h3>
              <div>
                <Button
                  small
                  inline
                  primary
                  icon={faChevronCircleRight}
                  transform="grow-1"
                  title="Nominate"
                  disabled={!isNominator()}
                  onClick={() => openModalWith('NominatePool', {}, 'small')}
                />
              </div>
            </CardHeaderWrapper>
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
          <PoolNominations />
        )}
      </CardWrapper>
    </PageRowWrapper>
  );
};

export default ManagePool;
