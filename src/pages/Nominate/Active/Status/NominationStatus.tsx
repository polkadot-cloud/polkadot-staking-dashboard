// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBolt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useStaking } from 'contexts/Staking';
import { useNominationStatus } from 'hooks/useNominationStatus';
import { useUnstaking } from 'hooks/useUnstaking';
import { Stat } from 'library/Stat';
import { useOverlay } from 'kits/Overlay/Provider';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useSyncing } from 'hooks/useSyncing';

export const NominationStatus = ({
  showButtons = true,
  buttonType = 'primary',
}: {
  showButtons?: boolean;
  buttonType?: string;
}) => {
  const { t } = useTranslation('pages');
  const { inSetup } = useStaking();
  const { openModal } = useOverlay().modal;
  const { getBondedAccount } = useBonded();
  const { syncing } = useSyncing(['initialization', 'era-stakers', 'balances']);
  const {
    isReady,
    networkMetrics: { fastUnstakeErasToCheckPerBlock },
  } = useApi();
  const { activeAccount } = useActiveAccounts();
  const { checking, isExposed } = useFastUnstake();
  const { isReadOnlyAccount } = useImportedAccounts();
  const { getNominationStatus } = useNominationStatus();
  const { getFastUnstakeText, isUnstaking } = useUnstaking();

  const fastUnstakeText = getFastUnstakeText();
  const controller = getBondedAccount(activeAccount);
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

  return (
    <Stat
      label={t('nominate.status')}
      helpKey="Nomination Status"
      stat={nominationStatus.message}
      buttons={
        !showButtons || syncing
          ? []
          : !inSetup()
            ? !isUnstaking
              ? [unstakeButton]
              : []
            : []
      }
      buttonType={buttonType}
    />
  );
};
