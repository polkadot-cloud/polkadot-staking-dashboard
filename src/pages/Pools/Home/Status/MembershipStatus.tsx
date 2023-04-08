// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { determinePoolDisplay } from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { Stat } from 'library/Stat';
import { useTranslation } from 'react-i18next';
import { useStatusButtons } from './useStatusButtons';

export const MembershipStatus = () => {
  const { t } = useTranslation('pages');
  const { isReady } = useApi();
  const { isPoolSyncing } = useUi();
  const { openModalWith } = useModal();
  const { label, buttons } = useStatusButtons();
  const { bondedPools, meta } = useBondedPools();
  const { getTransferOptions } = useTransferOptions();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { selectedActivePool, isOwner, isBouncer, isMember, isDepositor } =
    useActivePools();

  const { active } = getTransferOptions(activeAccount).pool;
  const poolState = selectedActivePool?.bondedPool?.state ?? null;

  const membershipButtons = [];
  let membershipDisplay = t('pools.notInPool');

  if (selectedActivePool) {
    const pool = bondedPools.find(
      (p: any) => p.addresses.stash === selectedActivePool.addresses.stash
    );
    if (pool) {
      // Determine pool membership display.
      const metadata = meta.bonded_pools?.metadata ?? [];
      const batchIndex = bondedPools.indexOf(pool);
      membershipDisplay = determinePoolDisplay(
        selectedActivePool.addresses.stash,
        metadata[batchIndex]
      );
    }

    // Display manage button if active account is pool owner or bouncer.
    if (poolState !== 'Destroying' && (isOwner() || isBouncer())) {
      membershipButtons.push({
        title: t('pools.manage'),
        icon: faCog,
        disabled: !isReady || isReadOnlyAccount(activeAccount),
        small: true,
        onClick: () => openModalWith('ManagePool', {}, 'small'),
      });
    }

    // Display leave button if active account is a pool member, but not the depositor.
    if (isMember() && !isDepositor() && active?.isGreaterThan(0)) {
      membershipButtons.push({
        title: t('pools.leave'),
        icon: faSignOutAlt,
        disabled: !isReady || isReadOnlyAccount(activeAccount),
        small: true,
        onClick: () => openModalWith('LeavePool', { bondFor: 'pool' }, 'small'),
      });
    }
  }

  return (
    <>
      {selectedActivePool ? (
        <>
          <Stat
            label={label}
            helpKey="Pool Membership"
            stat={{
              address: selectedActivePool?.addresses?.stash ?? '',
              display: membershipDisplay,
            }}
            buttons={membershipButtons}
          />
        </>
      ) : (
        <Stat
          label={t('pools.poolMembership')}
          helpKey="Pool Membership"
          stat={`${t('pools.notInPool')}`}
          buttons={isPoolSyncing ? [] : buttons}
        />
      )}
    </>
  );
};
