// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PageRow } from '@polkadotcloud/core-ui';
import { useApi } from 'contexts/Api';
import { usePlugins } from 'contexts/Plugins';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useTheme } from 'contexts/Themes';
import { CardWrapper } from 'library/Card/Wrappers';
import { useTranslation } from 'react-i18next';
import { MembersList as DefaultMemberList } from './MembersList/Default';
import { MembersList as FetchPageMemberList } from './MembersList/FetchPage';

export const Members = ({ poolMembersCount }: { poolMembersCount: number }) => {
  const { t } = useTranslation('pages');
  const { mode } = useTheme();
  const { pluginEnabled } = usePlugins();
  const { getMembersOfPoolFromNode } = usePoolMembers();
  const { selectedActivePool, isOwner, isBouncer } = useActivePools();
  const { colors } = useApi().network;

  const listTitle = `${t('pools.poolMember', {
    count: poolMembersCount,
  })}`;
  const annuncementBorderColor = colors.secondary[mode];

  const showBlockedPrompt =
    selectedActivePool?.bondedPool?.state === 'Blocked' &&
    (isOwner() || isBouncer());

  const membersListProps = {
    title: listTitle,
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
              memberCount={poolMembersCount}
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
