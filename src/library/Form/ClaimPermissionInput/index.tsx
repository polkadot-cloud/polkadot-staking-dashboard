// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ActionItem } from '@polkadot-cloud/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import type { ClaimPermission } from 'contexts/Pools/types';
import { TabWrapper, TabsWrapper } from 'library/Filter/Wrappers';

export interface ClaimPermissionInputProps {
  current: ClaimPermission | undefined;
  permissioned: boolean;
  onChange: (value: ClaimPermission | undefined) => void;
  disabled?: boolean;
}

export const ClaimPermissionInput = ({
  current,
  permissioned,
  onChange,
  disabled = false,
}: ClaimPermissionInputProps) => {
  const { t } = useTranslation('library');
  const { claimPermissionConfig } = usePoolMemberships();

  // Updated claim permission value
  const [selected, setSelected] = useState<ClaimPermission | undefined>(
    current
  );

  // Permissionless claim enabled.
  const [enabled, setEnabled] = useState<boolean>(permissioned);

  const activeTab = claimPermissionConfig.find(
    ({ value }) => value === selected
  );

  // Update selected value when current changes.
  useEffect(() => {
    setSelected(current);
  }, [current]);

  return (
    <>
      <ActionItem
        style={{
          marginTop: '2rem',
        }}
        text={t('enablePermissionlessClaiming')}
        toggled={enabled}
        onToggle={(val) => {
          // toggle enable claim permission.
          setEnabled(val);

          const newClaimPermission = val
            ? claimPermissionConfig[0].value
            : current === undefined
              ? undefined
              : 'Permissioned';

          setSelected(newClaimPermission);
          onChange(newClaimPermission);
        }}
        disabled={disabled}
        inactive={disabled}
      />
      <TabsWrapper
        style={{
          margin: '1rem 0',
          opacity: enabled && !disabled ? 1 : 'var(--opacity-disabled)',
        }}
      >
        {claimPermissionConfig.map(({ label, value }: any, i) => (
          <TabWrapper
            key={`pools_tab_filter_${i}`}
            $active={value === selected && enabled}
            disabled={value === selected || !enabled || disabled}
            onClick={() => {
              setSelected(value);
              onChange(value);
            }}
          >
            {label}
          </TabWrapper>
        ))}
      </TabsWrapper>
      <div
        style={{
          opacity: enabled && !disabled ? 1 : 'var(--opacity-disabled)',
        }}
      >
        {activeTab ? (
          <p>{activeTab.description}</p>
        ) : (
          <p>{t('permissionlessClaimingTurnedOff')}</p>
        )}
      </div>
    </>
  );
};
