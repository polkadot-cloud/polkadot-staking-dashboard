// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { ValidatorList } from 'library/ValidatorList';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { APIContextInterface } from 'types/api';
import { usePools } from 'contexts/Pools';
import { BatchKeys } from 'library/BatchKeys';
import { Wrapper } from './Wrapper';

export const PoolNominations = () => {
  const { isReady } = useApi() as APIContextInterface;
  const { isSyncing } = useUi();
  const { poolNominated }: any = useValidators();
  const { isNominator } = usePools();

  const batchKey = BatchKeys.new('pool_nominations');

  // TODO: plug in action to stop nominating.

  return (
    <Wrapper>
      <CardHeaderWrapper withAction>
        <h2>
          Pool Nominations
          <OpenAssistantIcon page="stake" title="Nominations" />
        </h2>
      </CardHeaderWrapper>
      {isSyncing ? (
        <div className="head">
          <h3>Syncing nominations...</h3>
        </div>
      ) : (
        <>
          {isReady && (
            <>
              {poolNominated.length > 0 ? (
                <div style={{ marginTop: '1rem' }}>
                  <ValidatorList
                    validators={poolNominated}
                    batchKey={batchKey}
                    title="Your Nominations"
                    selectable={isNominator()}
                    format="nomination"
                    target="pool"
                    refetchOnListUpdate
                    allowMoreCols
                    disableThrottle
                  />
                </div>
              ) : (
                <div className="head">
                  <h3>Not Nominating.</h3>
                </div>
              )}
            </>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default PoolNominations;
