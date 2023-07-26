// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { ButtonHelp, ButtonPrimary, PageRow } from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { GenerateNominations } from 'library/GenerateNominations';
import { Nominations } from 'pages/Nominate/Active/Nominations';
import { useTranslation } from 'react-i18next';

export const ManagePool = () => {
  const { t } = useTranslation('pages');
  const { isSyncing } = useUi();
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
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
  const { openHelp } = useHelp();

  const canNominate = isOwner() || isNominator();

  return (
    <PageRow>
      <CardWrapper>
        {isSyncing ? (
          <Nominations bondFor="pool" nominator={activeAccount} />
        ) : canNominate && !isNominating && state !== 'Destroying' ? (
          <>
            <CardHeaderWrapper $withAction>
              <h3>
                {t('pools.generateNominations')}
                <ButtonHelp
                  marginLeft
                  onClick={() => openHelp('Nominations')}
                />
              </h3>
              <div>
                <ButtonPrimary
                  iconLeft={faChevronCircleRight}
                  iconTransform="grow-1"
                  text={t('pools.nominate')}
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
          <Nominations bondFor="pool" nominator={nominator} />
        )}
      </CardWrapper>
    </PageRow>
  );
};
