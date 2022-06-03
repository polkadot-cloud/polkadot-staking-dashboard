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
import { SectionHeaderWrapper } from 'library/Graphs/Wrappers';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { Wrapper } from './Wrapper';

export const Nominations = () => {
  const { openModalWith } = useModal();
  const { isReady } = useApi() as APIContextInterface;
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { nominated }: any = useValidators();
  const { inSetup } = useStaking();
  const { getAccountNominations }: any = useBalances();
  const { isSyncing } = useUi();
  const nominations = getAccountNominations(activeAccount);

  const batchKey = 'stake_nominations';

  // callback function to stop nominating selected validators
  const cbStopNominatingSelected = (provider: any) => {
    const { selected } = provider;
    const _nominations = [...nominations].filter((n: any) => {
      return !selected.map((_s: any) => _s.address).includes(n);
    });
    openModalWith(
      'StopNominating',
      {
        nominations: _nominations,
        provider,
      },
      'small'
    );
  };

  return (
    <Wrapper>
      <SectionHeaderWrapper withAction>
        <h2>
          Nominations
          <OpenAssistantIcon page="stake" title="Nominations" />
        </h2>
        <div>
          {nominations.length ? (
            <div>
              <Button
                small
                icon={faStopCircle}
                transform="grow-1"
                inline
                primary
                title="Stop"
                disabled={inSetup() || isSyncing}
                onClick={() =>
                  openModalWith(
                    'StopNominating',
                    {
                      nominations: [],
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
      </SectionHeaderWrapper>
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
                    selectable
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
