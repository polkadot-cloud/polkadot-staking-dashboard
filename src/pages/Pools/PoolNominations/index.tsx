// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { ValidatorList } from 'library/ValidatorList';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { useUi } from 'contexts/UI';
import { SectionHeaderWrapper } from 'library/Graphs/Wrappers';
import { APIContextInterface } from 'types/api';
import { usePools } from 'contexts/Pools';
import { Wrapper } from './Wrapper';

export const PoolNominations = () => {
  const { isReady } = useApi() as APIContextInterface;
  const { isSyncing } = useUi();
  const { poolNominated }: any = useValidators();
  const { isNominator } = usePools();
  const batchKey = 'pool_nominations';

  return (
    <Wrapper>
      <SectionHeaderWrapper withAction>
        <h2>
          Pool Nominations
          <OpenAssistantIcon page="stake" title="Nominations" />
        </h2>
      </SectionHeaderWrapper>
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
