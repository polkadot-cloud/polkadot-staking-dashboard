// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabWrapper, TabsWrapper } from 'library/Filter/Wrappers';
import type { ClaimPermission } from 'contexts/Pools/types';
import type { ClaimPermissionConfig } from '../types';

export interface ClaimPermissionInputProps {
  current: ClaimPermission | undefined;
  onChange: (value: ClaimPermission | undefined) => void;
  disabled?: boolean;
}

export const ClaimPermissionInput = ({
  current,
  onChange,
  disabled = false,
}: ClaimPermissionInputProps) => {
  const { t } = useTranslation('library');

  const claimPermissionConfig: ClaimPermissionConfig[] = [
    {
      label: t('allowWithdraw'),
      value: 'PermissionlessWithdraw',
      description: t('allowAnyoneWithdraw'),
    },
    {
      label: t('allowCompound'),
      value: 'PermissionlessCompound',
      description: t('allowAnyoneCompound'),
    },
    {
      label: 'Permissioned',
      value: 'Permissioned',
      description: 'Only you can claim rewards.',
    },
  ];

  // Updated claim permission value
  const [selected, setSelected] = useState<ClaimPermission | undefined>(
    current
  );

  // Permissionless claim enabled.
  const [enabled] = useState<boolean>(true);

  const activeTab = claimPermissionConfig.find(
    ({ value }) => value === selected
  );

  // Update selected value when current changes.
  useEffect(() => {
    setSelected(current);
  }, [current]);

  return (
    <>
      <TabsWrapper
        style={{
          margin: '1rem 0',
          opacity: enabled && !disabled ? 1 : 'var(--opacity-disabled)',
        }}
      >
        {claimPermissionConfig.map(({ label, value }, i) => (
          <TabWrapper
            key={`pools_tab_filter_${i}`}
            $active={value === selected && enabled}
            disabled={value === selected || !enabled || disabled}
            onClick={() => {
              setSelected(value);
              onChange(value);
            }}
            style={{ flexGrow: 1 }}
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
          <h4 style={{ color: 'var(--text-color-secondary)' }}>
            {activeTab.description}
          </h4>
        ) : (
          <h4 style={{ color: 'var(--text-color-secondary)' }}>
            {t('permissionlessClaimingTurnedOff')}
          </h4>
        )}
      </div>
    </>
  );
};
