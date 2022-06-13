// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { ValidatorList } from 'library/ValidatorList';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { Button } from 'library/Button';
import { useModal } from 'contexts/Modal';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { useStaking } from 'contexts/Staking';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { ActivePoolContextState } from 'types/pools';
import { Wrapper } from './Wrapper';

export const Nominations = ({ bondType }: { bondType: 'pool' | 'stake' }) => {
  const { openModalWith } = useModal();
  const { isReady } = useApi() as APIContextInterface;
  const { inSetup } = useStaking();
  const { isSyncing } = useUi();
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { getAccountNominations }: any = useBalances();
  const { nominated: stakeNominated, poolNominated }: any = useValidators();

  const {
    poolNominations,
    isNominator: isPoolNominator,
    isOwner: isPoolOwner,
  } = useActivePool() as ActivePoolContextState;

  const isPool = bondType === 'pool';
  const nominations = isPool
    ? poolNominations.targets
    : getAccountNominations(activeAccount);
  const nominated = isPool ? poolNominated : stakeNominated;
  const batchKey = isPool ? 'pool_nominations' : 'stake_nominations';

  // callback function to stop nominating selected validators
  const cbStopNominatingSelected = (provider: any) => {
    const { selected } = provider;
    const _nominations = [...nominations].filter((n: any) => {
      return !selected.map((_s: any) => _s.address).includes(n);
    });
    openModalWith(
      'ChangeNominations',
      {
        nominations: _nominations,
        provider,
        bondType,
      },
      'small'
    );
  };

  return (
    <Wrapper>
      <CardHeaderWrapper withAction>
        <h2>
          {isPool ? 'Pool Nominations' : 'Nominations'}
          <OpenAssistantIcon page="stake" title="Nominations" />
        </h2>
        <div>
          {(isPool &&
            isPoolOwner() &&
            isPoolNominator() &&
            nominations.length) ||
          (!isPool && nominations.length) ? (
            <div>
              <Button
                small
                icon={faStopCircle}
                transform="grow-1"
                inline
                primary
                title="Stop"
                disabled={(!isPool && inSetup()) || isSyncing}
                onClick={() =>
                  openModalWith(
                    'ChangeNominations',
                    {
                      nominations: [],
                      bondType,
                    },
                    'small'
                  )
                }
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </CardHeaderWrapper>
      {!activeAccount ? (
        <div className="head">
          <h3>Not Nominating.</h3>
        </div>
      ) : nominated === null || isSyncing ? (
        <div className="head">
          <h3>Syncing nominations...</h3>
        </div>
      ) : (
        <>
          {isReady && (
            <>
              {nominated.length > 0 ? (
                <div style={{ marginTop: '1rem' }}>
                  <ValidatorList
                    validators={nominated}
                    batchKey={batchKey}
                    title="Your Nominations"
                    format="nomination"
                    bondType={isPool ? 'pool' : 'stake'}
                    selectable={!isPool || isPoolNominator()}
                    actions={[
                      {
                        title: 'Stop Nominating Selected',
                        onClick: cbStopNominatingSelected,
                        onSelected: true,
                      },
                    ]}
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

export default Nominations;
