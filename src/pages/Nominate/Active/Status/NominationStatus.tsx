// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faBolt,
  faChevronCircleRight,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useModal } from 'contexts/Modal';
import { useNetworkMetrics } from 'contexts/Network';
import { useSetup } from 'contexts/Setup';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useNominationStatus } from 'library/Hooks/useNominationStatus';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { Stat } from 'library/Stat';
import { useTranslation } from 'react-i18next';

export const NominationStatus = () => {
  const { t } = useTranslation('pages');
  const { isReady } = useApi();
  const { inSetup } = useStaking();
  const { isNetworkSyncing } = useUi();
  const { openModalWith } = useModal();
  const { metrics } = useNetworkMetrics();
  const { getBondedAccount } = useBonded();
  const { checking, isExposed } = useFastUnstake();
  const { getNominationStatus } = useNominationStatus();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { getFastUnstakeText, isUnstaking } = useUnstaking();
  const { setOnNominatorSetup, getNominatorSetupPercent } = useSetup();

  const fastUnstakeText = getFastUnstakeText();
  const controller = getBondedAccount(activeAccount);
  const { fastUnstakeErasToCheckPerBlock } = metrics;
  const nominationStatus = getNominationStatus(activeAccount, 'nominator');

  // Determine whether to display fast unstake button or regular unstake button.
  const unstakeButton =
    fastUnstakeErasToCheckPerBlock > 0 &&
    !nominationStatus.activeNominees.length &&
    (checking || !isExposed)
      ? {
          disabled: checking,
          title: fastUnstakeText,
          icon: faBolt,
          onClick: () => {
            openModalWith('ManageFastUnstake', {}, 'small');
          },
        }
      : {
          title: t('nominate.unstake'),
          icon: faSignOutAlt,
          disabled: !isReady || isReadOnlyAccount(controller) || !activeAccount,
          onClick: () => openModalWith('Unstake', {}, 'small'),
        };

  // Display progress alongside start title if exists and in setup.
  let startTitle = t('nominate.startNominating');
  if (inSetup()) {
    const progress = getNominatorSetupPercent(activeAccount);
    if (progress > 0) {
      startTitle += `: ${progress}%`;
    }
  }

  return (
    <Stat
      label={t('nominate.status')}
      helpKey="Nomination Status"
      stat={nominationStatus.message}
      buttons={
        !inSetup()
          ? !isUnstaking && !isReadOnlyAccount(controller)
            ? [unstakeButton]
            : []
          : isNetworkSyncing
          ? []
          : [
              {
                title: startTitle,
                icon: faChevronCircleRight,
                transform: 'grow-1',
                disabled:
                  !isReady ||
                  isReadOnlyAccount(activeAccount) ||
                  !activeAccount,
                onClick: () => setOnNominatorSetup(true),
              },
            ]
      }
    />
  );
};
