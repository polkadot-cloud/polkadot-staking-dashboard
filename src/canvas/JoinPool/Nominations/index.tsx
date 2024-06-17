// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ValidatorList } from 'library/ValidatorList';
import { useTranslation } from 'react-i18next';
import { HeadingWrapper, NominationsWrapper } from '../Wrappers';
import type { NominationsProps } from '../types';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { useBondedPools } from 'contexts/Pools/BondedPools';

export const Nominations = ({ stash, poolId }: NominationsProps) => {
  const { t } = useTranslation();
  const { validators } = useValidators();
  const { poolsNominations } = useBondedPools();

  // Extract validator entries from pool targets.
  const targets = poolsNominations[poolId]?.targets || [];
  const filteredTargets = validators.filter(({ address }) =>
    targets.includes(address)
  );

  return (
    <NominationsWrapper>
      <HeadingWrapper>
        <h3>
          {!targets.length
            ? t('nominate.noNominationsSet', { ns: 'pages' })
            : `${targets.length} ${t('nominations', { ns: 'library', count: targets.length })}`}
        </h3>
      </HeadingWrapper>

      {targets.length > 0 && (
        <ValidatorList
          format="nomination"
          bondFor="pool"
          validators={filteredTargets}
          nominator={stash}
          showMenu={false}
          displayFor="canvas"
          allowListFormat={false}
          allowMoreCols={true}
          refetchOnListUpdate
        />
      )}
    </NominationsWrapper>
  );
};
