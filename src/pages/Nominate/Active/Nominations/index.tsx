// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { PoolState } from 'contexts/Pools/types';
import { useTranslation } from 'react-i18next';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators';
import { Button } from 'library/Button';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { ValidatorList } from 'library/ValidatorList';
import { MaybeAccount } from 'types';
import { Wrapper } from './Wrapper';

export const Nominations = ({
  bondType,
  nominator,
}: {
  bondType: 'pool' | 'stake';
  nominator: MaybeAccount;
}) => {
  const { openModalWith } = useModal();
  const { inSetup } = useStaking();
  const { isSyncing } = useUi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { getAccountNominations } = useBalances();
  const { nominated: stakeNominated, poolNominated } = useValidators();
  let { favoritesList } = useValidators();
  if (favoritesList === null) {
    favoritesList = [];
  }

  const {
    poolNominations,
    isNominator: isPoolNominator,
    isOwner: isPoolOwner,
    selectedActivePool,
  } = useActivePools();

  const isPool = bondType === 'pool';
  const nominations = isPool
    ? poolNominations.targets
    : getAccountNominations(nominator);
  const nominated = isPool ? poolNominated : stakeNominated;
  const batchKey = isPool ? 'pool_nominations' : 'stake_nominations';
  const { t } = useTranslation('common');

  const nominating = nominated?.length ?? false;

  // callback function to stop nominating selected validators
  const cbStopNominatingSelected = (provider: any) => {
    const { selected } = provider;
    const _nominations = [...nominations].filter((n) => {
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

  // callback function for adding nominations
  const cbAddNominations = ({ setSelectActive }: any) => {
    setSelectActive(false);
    openModalWith(
      'NominateFromFavorites',
      {
        nominations,
        bondType,
      },
      'xl'
    );
  };

  // determine whether buttons are disabled
  const poolDestroying =
    isPool &&
    selectedActivePool?.bondedPool?.state === PoolState.Destroy &&
    !nominating;

  const stopBtnDisabled =
    (!isPool && inSetup()) ||
    isSyncing ||
    isReadOnlyAccount(activeAccount) ||
    poolDestroying;

  return (
    <Wrapper>
      <CardHeaderWrapper withAction>
        <h3>
          {isPool
            ? t('pages.nominate.pool_nominations')
            : t('pages.nominate.nominations')}
          <OpenHelpIcon helpKey="Nominations" />
        </h3>
        <div>
          {/* If regular staking and nominating, display stop button.
              If Pool and account is nominator or root, display stop button.
          */}
          {((!isPool && nominations.length) ||
            (isPool && (isPoolNominator() || isPoolOwner()))) && (
            <Button
              small
              icon={faStopCircle}
              transform="grow-1"
              inline
              primary
              title={t('pages.nominate.stop')}
              disabled={stopBtnDisabled}
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
          )}
        </div>
      </CardHeaderWrapper>
      {nominated === null || isSyncing ? (
        <div className="head">
          <h4>
            {!isSyncing && nominated === null
              ? t('pages.nominate.not_nominating')
              : t('pages.nominate.syncing')}
          </h4>
        </div>
      ) : !nominator ? (
        <div className="head">
          <h4>{t('pages.nominate.not_nominating')}</h4>
        </div>
      ) : (
        <>
          {nominated.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              <ValidatorList
                bondType={isPool ? 'pool' : 'stake'}
                validators={nominated}
                nominator={nominator}
                batchKey={batchKey}
                title={t('pages.nominate.your_nominations')}
                format="nomination"
                selectable={
                  !isReadOnlyAccount(activeAccount) &&
                  (!isPool || isPoolNominator() || isPoolOwner())
                }
                actions={
                  isReadOnlyAccount(activeAccount)
                    ? []
                    : [
                        {
                          title: t('pages.nominate.stop_nominating_selected'),
                          onClick: cbStopNominatingSelected,
                          onSelected: true,
                        },
                        {
                          disabled: !favoritesList.length,
                          title: t('pages.nominate.add_from_favorites'),
                          onClick: cbAddNominations,
                          onSelected: false,
                        },
                      ]
                }
                refetchOnListUpdate
                allowMoreCols
                disableThrottle
              />
            </div>
          ) : (
            <div className="head">
              {poolDestroying ? (
                <h4>{t('pages.nominate.pool_destroy')}</h4>
              ) : (
                <h4>{t('pages.nominate.not_nominating')}</h4>
              )}
            </div>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default Nominations;
