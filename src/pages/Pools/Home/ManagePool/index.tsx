// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useUi } from 'contexts/UI';
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
  const {
    isOwner,
    isNominator,
    setTargets,
    targets,
    poolNominations,
    selectedActivePool,
  } = useActivePools();
  const { t } = useTranslation('pages');

  const isNominating = !!poolNominations?.targets?.length;
  const nominator = selectedActivePool?.addresses?.stash ?? null;
  const { state } = selectedActivePool?.bondedPool || {};

  const canNominate = isOwner() || isNominator();

  return (
    <PageRowWrapper className="page-padding" noVerticalSpacer>
      <CardWrapper>
        {isSyncing ? (
          <Nominations bondFor="pool" nominator={activeAccount} />
        ) : canNominate && !isNominating && state !== 'destroying' ? (
          <>
            <CardHeaderWrapper withAction>
              <h3>
                {t('pools.generateNominations')}
                <OpenHelpIcon helpKey="Nominations" />
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
    </PageRowWrapper>
  );
};

export default ManagePool;
