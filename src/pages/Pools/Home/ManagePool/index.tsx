// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { PoolState } from 'contexts/Pools/types';
import { useUi } from 'contexts/UI';
import { Button } from 'library/Button';
import { GenerateNominations } from 'library/GenerateNominations';
import { CardHeaderWrapper, CardWrapper } from 'library/Graphs/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import Nominations from 'pages/Nominate/Active/Nominations';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper } from 'Wrappers';

export const ManagePool = () => {
  const { isSyncing } = useUi();
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { t } = useTranslation('common');
  const {
    isOwner,
    isNominator,
    setTargets,
    targets,
    poolNominations,
    selectedActivePool,
  } = useActivePools();

  const isNominating = !!poolNominations?.targets?.length;
  const nominator = selectedActivePool?.addresses?.stash ?? null;
  const { state } = selectedActivePool?.bondedPool || {};

  const canNominate = isOwner() || isNominator();

  return (
    <PageRowWrapper className="page-padding" noVerticalSpacer>
      <CardWrapper>
        {isSyncing ? (
          <Nominations bondType="pool" nominator={activeAccount} />
        ) : canNominate && !isNominating && state !== PoolState.Destroy ? (
          <>
            <CardHeaderWrapper withAction>
              <h3>
                {t('pages.pools.generate_nominations')}
                <OpenHelpIcon helpKey="Nominations" />
              </h3>
              <div>
                <Button
                  small
                  inline
                  primary
                  icon={faChevronCircleRight}
                  transform="grow-1"
                  title={t('pages.pools.nominate')}
                  disabled={!canNominate}
                  onClick={() => openModalWith('NominatePool', {}, 'small')}
                />
              </div>
            </CardHeaderWrapper>
            <GenerateNominations
              batchKey="generate_pool_nominations"
              nominations={targets.nominations}
              setters={[
                {
                  set: setTargets,
                  current: targets,
                },
              ]}
            />
          </>
        ) : (
          <Nominations bondType="pool" nominator={nominator} />
        )}
      </CardWrapper>
    </PageRowWrapper>
  );
};

export default ManagePool;
