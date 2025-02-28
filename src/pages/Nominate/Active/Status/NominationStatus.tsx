// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faBolt,
  faChevronCircleRight,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useSetup } from 'contexts/Setup';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useNominationStatus } from 'library/Hooks/useNominationStatus';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { Stat } from 'library/Stat';
import { useTranslation } from 'react-i18next';
import { registerSaEvent } from 'Utils';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useNetwork } from 'contexts/Network';

export const NominationStatus = ({
  showButtons = true,
  buttonType = 'primary',
}: {
  showButtons?: boolean;
  buttonType?: string;
}) => {
  const { t } = useTranslation('pages');
  const { isReady } = useApi();
  const { network } = useNetwork();
  const { inSetup } = useStaking();
  const { isNetworkSyncing } = useUi();
  const { openModal } = useOverlay().modal;
  const { metrics } = useNetworkMetrics();
  const { getBondedAccount } = useBonded();
  const { checking, isExposed } = useFastUnstake();
  const { isReadOnlyAccount } = useImportedAccounts();
  const { getNominationStatus } = useNominationStatus();
  const { activeAccount } = useActiveAccounts();
  const { getFastUnstakeText, isUnstaking } = useUnstaking();
  const { setOnNominatorSetup, getNominatorSetupPercent } = useSetup();

  const fastUnstakeText = getFastUnstakeText();
  const controller = getBondedAccount(activeAccount);
  const { fastUnstakeErasToCheckPerBlock } = metrics;
  const nominationStatus = getNominationStatus(activeAccount, 'nominator');

  // Determine whether to display fast unstake button or regular unstake button.
  const unstakeButton =
    fastUnstakeErasToCheckPerBlock > 0 &&
    !nominationStatus.nominees.active.length &&
    (checking || !isExposed)
      ? {
          disabled: checking || isReadOnlyAccount(controller),
          title: fastUnstakeText,
          icon: faBolt,
          onClick: () => {
            openModal({ key: 'ManageFastUnstake', size: 'sm' });
          },
        }
      : {
          title: t('nominate.unstake'),
          icon: faSignOutAlt,
          disabled: !isReady || isReadOnlyAccount(controller) || !activeAccount,
          onClick: () => openModal({ key: 'Unstake', size: 'sm' }),
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
        !showButtons
          ? []
          : !inSetup()
            ? !isUnstaking
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
                    onClick: () => {
                      registerSaEvent(
                        `${network.toLowerCase()}_nominate_setup_button_pressed`
                      );
                      setOnNominatorSetup(true);
                    },
                  },
                ]
      }
      buttonType={buttonType}
    />
  );
};
