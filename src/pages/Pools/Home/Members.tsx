// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PageRow } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { usePlugins } from 'contexts/Plugins';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useTheme } from 'contexts/Themes';
import { CardWrapper } from 'library/Card/Wrappers';
import { useNetwork } from 'contexts/Network';
import { MembersList as DefaultMemberList } from './MembersList/Default';
import { MembersList as FetchPageMemberList } from './MembersList/FetchPage';

export const Members = () => {
  const { t } = useTranslation('pages');
  const { mode } = useTheme();
  const { pluginEnabled } = usePlugins();
  const { getMembersOfPoolFromNode } = usePoolMembers();
  const { selectedActivePool, isOwner, isBouncer, selectedPoolMemberCount } =
    useActivePools();
  const { colors } = useNetwork().networkData;

  const annuncementBorderColor = colors.secondary[mode];

  const showBlockedPrompt =
    selectedActivePool?.bondedPool?.state === 'Blocked' &&
    (isOwner() || isBouncer());

  const membersListProps = {
    batchKey: 'active_pool_members',
    pagination: true,
    selectToggleable: false,
    allowMoreCols: true,
  };

  return (
    <>
      {/* Pool in Blocked state: allow root & bouncer to unbond & withdraw members */}
      {showBlockedPrompt && (
        <PageRow>
          <CardWrapper
            style={{ border: `1px solid ${annuncementBorderColor}` }}
          >
            <div className="content">
              <h3>{t('pools.poolCurrentlyLocked')}</h3>
              <h4>
                {t('pools.permissionToUnbond')}({' '}
                <FontAwesomeIcon icon={faBars} transform="shrink-2" /> ){' '}
                {t('pools.managementOptions')}
              </h4>
            </div>
          </CardWrapper>
        </PageRow>
      )}

      {/* Pool in Destroying state: allow anyone to unbond & withdraw members */}
      {selectedActivePool?.bondedPool?.state === 'Destroying' && (
        <PageRow>
          <CardWrapper
            style={{ border: `1px solid ${annuncementBorderColor}` }}
          >
            <div className="content">
              <h3>{t('pools.poolInDestroyingState')}</h3>
              <h4>
                {t('pools.permissionToUnbond')} ({' '}
                <FontAwesomeIcon icon={faBars} transform="shrink-2" /> ){' '}
                {t('pools.managementOptions')}
              </h4>
            </div>
          </CardWrapper>
        </PageRow>
      )}

      <PageRow>
        <CardWrapper>
          {pluginEnabled('subscan') ? (
            <FetchPageMemberList
              {...membersListProps}
              memberCount={selectedPoolMemberCount}
            />
          ) : (
            <DefaultMemberList
              {...membersListProps}
              members={getMembersOfPoolFromNode(selectedActivePool?.id ?? 0)}
            />
          )}
        </CardWrapper>
      </PageRow>
    </>
  );
};
