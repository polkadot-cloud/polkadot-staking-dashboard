// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonPrimaryInvert } from '@polkadot-cloud/react';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators';
import { ValidatorList } from 'library/ValidatorList';
import type { ManageNominationsInterface } from 'pages/Nominate/Active/Nominations/types';
import { useTranslation } from 'react-i18next';

export const ManageNominations = () => {
  const { t } = useTranslation('pages');
  const {
    closeCanvas,
    config: { options },
  } = useOverlay().canvas;
  const { activeAccount } = useActiveAccounts();
  const { favoritesList } = useFavoriteValidators();
  const { isReadOnlyAccount } = useImportedAccounts();
  const { isOwner: isPoolOwner, isNominator: isPoolNominator } =
    useActivePools();

  // Derive options from canvas config.
  // eslint-disable-next-line
  const nominations = options?.nominations || [];
  const bondFor = options?.bondFor || 'nominator';
  const nominator = options?.nominator || null;
  const nominated = options?.nominated || [];

  // Determine if pool or nominator.
  const isPool = bondFor === 'pool';

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ButtonPrimaryInvert text="Close" lg onClick={() => closeCanvas()} />
      </div>
      <h1 style={{ marginTop: '1.5rem' }}>Manage Nominations</h1>

      <ValidatorList
        title={t('nominate.yourNominations')}
        bondFor={bondFor}
        validators={nominated}
        nominator={nominator}
        batchKey={isPool ? 'pool_nominations' : 'stake_nominations'}
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
                  title: t('nominate.stopNominatingSelected'),
                  onClick: (provider: ManageNominationsInterface) => {
                    // eslint-disable-next-line
                    const { selected } = provider;
                    /* Refactoring for real-time updates to list & submit button.
                    openModal({
                      key: 'ChangeNominations',
                      options: {
                        nominations: [...nominations].filter(
                          (n) =>
                            !selected.map(({ address }) => address).includes(n)
                        ),
                        provider,
                        bondFor,
                      },
                      size: 'sm',
                    });
                    */
                  },
                  onSelected: true,
                },
                {
                  isDisabled: () => !favoritesList?.length,
                  title: t('nominate.addFromFavorites'),
                  onClick: ({
                    setSelectActive,
                  }: ManageNominationsInterface) => {
                    setSelectActive(false);
                    /* Refactoring for real-time updates to list & submit button.
                    openModal({
                      key: 'NominateFromFavorites',
                      options: {
                        nominations,
                        bondFor,
                      },
                      size: 'xl',
                    });
                    */
                  },
                  onSelected: false,
                },
              ]
        }
        refetchOnListUpdate
        allowMoreCols
        disableThrottle
      />
    </>
  );
};
