// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCog, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useStaking } from 'contexts/Staking';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { useUnstaking } from 'hooks/useUnstaking';
import { ValidatorList } from 'library/ValidatorList';
import type { MaybeAddress } from 'types';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { ListStatusHeader } from 'library/List';
import { Wrapper } from './Wrapper';
import { useSyncing } from 'hooks/useSyncing';
import { useBalances } from 'contexts/Balances';
import { ButtonPrimary } from 'library/kits/Buttons/ButtonPrimary';
import { ButtonHelp } from 'library/kits/Buttons/ButtonHelp';

export const Nominations = ({
  bondFor,
  nominator,
}: {
  bondFor: 'pool' | 'nominator';
  nominator: MaybeAddress;
}) => {
  const { t } = useTranslation('pages');
  const {
    activePool,
    activePoolNominations,
    isOwner: isPoolOwner,
    isNominator: isPoolNominator,
  } = useActivePool();
  const { openHelp } = useHelp();
  const { inSetup } = useStaking();
  const {
    modal: { openModal },
    canvas: { openCanvas },
  } = useOverlay();
  const { syncing } = useSyncing('*');
  const { getNominations } = useBalances();
  const { isFastUnstaking } = useUnstaking();
  const { formatWithPrefs } = useValidators();
  const { activeAccount } = useActiveAccounts();
  const { isReadOnlyAccount } = useImportedAccounts();

  // Determine if pool or nominator.
  const isPool = bondFor === 'pool';

  // Derive nominations from `bondFor` type.
  const nominated =
    bondFor === 'nominator'
      ? formatWithPrefs(getNominations(activeAccount))
      : activePoolNominations
        ? formatWithPrefs(activePoolNominations.targets)
        : [];

  // Determine if this nominator is actually nominating.
  const isNominating = nominated?.length ?? false;

  // Determine whether this is a pool that is in Destroying state & not nominating.
  const poolDestroying =
    isPool && activePool?.bondedPool?.state === 'Destroying' && !isNominating;

  // Determine whether to display buttons.
  //
  // If regular staking and nominating, or if pool and account is nominator or root, display stop
  // button.
  const displayBtns =
    (!isPool && nominated.length) ||
    (isPool && (isPoolNominator() || isPoolOwner()));

  // Determine whether buttons are disabled.
  const btnsDisabled =
    (!isPool && inSetup()) ||
    syncing ||
    isReadOnlyAccount(activeAccount) ||
    poolDestroying ||
    isFastUnstaking;

  return (
    <Wrapper>
      <CardHeaderWrapper $withAction $withMargin>
        <h3>
          {isPool ? t('nominate.poolNominations') : t('nominate.nominations')}
          <ButtonHelp marginLeft onClick={() => openHelp('Nominations')} />
        </h3>
        <div>
          {displayBtns && (
            <>
              <ButtonPrimary
                text={t('nominate.stop')}
                iconLeft={faStopCircle}
                iconTransform="grow-1"
                disabled={btnsDisabled}
                onClick={() =>
                  openModal({
                    key: 'StopNominations',
                    options: {
                      nominations: [],
                      bondFor,
                    },
                    size: 'sm',
                  })
                }
              />
              <ButtonPrimary
                text={t('nominate.manage')}
                iconLeft={faCog}
                iconTransform="grow-1"
                disabled={btnsDisabled}
                marginLeft
                onClick={() =>
                  openCanvas({
                    key: 'ManageNominations',
                    scroll: false,
                    options: {
                      bondFor,
                      nominator,
                      nominated,
                    },
                    size: 'xl',
                  })
                }
              />
            </>
          )}
        </div>
      </CardHeaderWrapper>
      {syncing ? (
        <ListStatusHeader>{`${t('nominate.syncing')}...`}</ListStatusHeader>
      ) : !nominator ? (
        <ListStatusHeader>{t('nominate.notNominating')}.</ListStatusHeader>
      ) : (nominated?.length || 0) > 0 ? (
        <ValidatorList
          bondFor={bondFor}
          validators={nominated || []}
          nominator={nominator}
          format="nomination"
          refetchOnListUpdate
          allowMoreCols
          disableThrottle
          allowListFormat={false}
        />
      ) : poolDestroying ? (
        <ListStatusHeader>{t('nominate.poolDestroy')}</ListStatusHeader>
      ) : (
        <ListStatusHeader>{t('nominate.notNominating')}.</ListStatusHeader>
      )}
    </Wrapper>
  );
};
