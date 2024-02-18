// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { PageRow } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { Nominations } from 'library/Nominations';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useSyncing } from 'hooks/useSyncing';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { ButtonHelp } from 'library/kits/Buttons/ButtonHelp';
import { ButtonPrimary } from 'library/kits/Buttons/ButtonPrimary';

export const ManagePool = () => {
  const { t } = useTranslation();
  const { syncing } = useSyncing(['active-pools']);
  const { openCanvas } = useOverlay().canvas;
  const { formatWithPrefs } = useValidators();
  const { activeAccount } = useActiveAccounts();
  const { isOwner, isNominator, activePoolNominations, activePool } =
    useActivePool();

  const poolNominated = activePoolNominations
    ? formatWithPrefs(activePoolNominations.targets)
    : [];

  const isNominating = !!activePoolNominations?.targets?.length;
  const nominator = activePool?.addresses?.stash ?? null;
  const { state } = activePool?.bondedPool || {};
  const { openHelp } = useHelp();

  const canNominate = isOwner() || isNominator();

  return (
    <PageRow>
      <CardWrapper>
        {syncing ? (
          <Nominations bondFor="pool" nominator={activeAccount} />
        ) : canNominate && !isNominating && state !== 'Destroying' ? (
          <>
            <CardHeaderWrapper $withAction $withMargin>
              <h3>
                {t('nominate.nominations', { ns: 'pages' })}
                <ButtonHelp
                  marginLeft
                  onClick={() => openHelp('Nominations')}
                />
              </h3>
              <div>
                <ButtonPrimary
                  iconLeft={faChevronCircleRight}
                  iconTransform="grow-1"
                  text={t('pools.nominate', { ns: 'pages' })}
                  disabled={!canNominate}
                  onClick={() =>
                    openCanvas({
                      key: 'ManageNominations',
                      scroll: false,
                      options: {
                        bondFor: 'pool',
                        nominator,
                        nominated: poolNominated || [],
                      },
                      size: 'xl',
                    })
                  }
                />
              </div>
            </CardHeaderWrapper>
            <h4>{t('notNominating', { ns: 'library' })}.</h4>
          </>
        ) : (
          <Nominations bondFor="pool" nominator={nominator} />
        )}
      </CardWrapper>
    </PageRow>
  );
};
