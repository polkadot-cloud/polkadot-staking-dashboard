// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCog, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { ButtonHelp, ButtonPrimary } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useBonded } from 'contexts/Bonded';
import { useHelp } from 'contexts/Help';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { ValidatorList } from 'library/ValidatorList';
import type { MaybeAddress } from 'types';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { ListStatusHeader } from 'library/List';
import { Wrapper } from './Wrapper';

export const Nominations = ({
  bondFor,
  nominator,
}: {
  bondFor: 'pool' | 'nominator';
  nominator: MaybeAddress;
}) => {
  const { t } = useTranslation('pages');
  const {
    poolNominations,
    selectedActivePool,
    isOwner: isPoolOwner,
    isNominator: isPoolNominator,
  } = useActivePools();
  const { isSyncing } = useUi();
  const { openHelp } = useHelp();
  const { inSetup } = useStaking();
  const {
    modal: { openModal },
    canvas: { openCanvas },
  } = useOverlay();
  const { getNominated } = useValidators();
  const { isFastUnstaking } = useUnstaking();
  const { activeAccount } = useActiveAccounts();
  const { getAccountNominations } = useBonded();
  const { isReadOnlyAccount } = useImportedAccounts();

  // Determine if pool or nominator.
  const isPool = bondFor === 'pool';

  // Derive nominations from `bondFor` type.
  const nominations = isPool
    ? poolNominations.targets
    : getAccountNominations(nominator);
  const nominated = getNominated(bondFor);

  // Determine if this nominator is actually nominating.
  const isNominating = nominated?.length ?? false;

  // Determine whether this is a pool that is in Destroying state & not nominating.
  const poolDestroying =
    isPool &&
    selectedActivePool?.bondedPool?.state === 'Destroying' &&
    !isNominating;

  // Determine whether to display buttons.
  //
  // If regular staking and nominating, or if pool and account is nominator or root, display stop
  // button.
  const displayBtns =
    (!isPool && nominations.length) ||
    (isPool && (isPoolNominator() || isPoolOwner()));

  // Determine whether buttons are disabled.
  const btnsDisabled =
    (!isPool && inSetup()) ||
    isSyncing ||
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
      {isSyncing ? (
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
