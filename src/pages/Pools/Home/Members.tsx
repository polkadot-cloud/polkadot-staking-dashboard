// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PageRow } from '@polkadotcloud/core-ui';
import { useApi } from 'contexts/Api';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useTheme } from 'contexts/Themes';
import { CardWrapper } from 'library/Card/Wrappers';
import { useTranslation } from 'react-i18next';
import { MembersList } from './MembersList/Default';

export const Members = () => {
  const { t } = useTranslation('pages');
  const { colors } = useApi().network;
  const { mode } = useTheme();
  const { getMembersOfPool } = usePoolMembers();
  const { selectedActivePool, isOwner, isBouncer } = useActivePools();

  const poolMembers = getMembersOfPool(selectedActivePool?.id ?? 0);
  const poolMembersTitle = `${t('pools.poolMember', {
    count: poolMembers.length,
  })}`;
  const annuncementBorderColor = colors.secondary[mode];

  const showBlockedPrompt =
    selectedActivePool?.bondedPool?.state === 'Blocked' &&
    (isOwner() || isBouncer());

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
          <MembersList
            title={poolMembersTitle}
            batchKey="active_pool_members"
            members={poolMembers}
            pagination
            selectToggleable={false}
            allowMoreCols
          />
        </CardWrapper>
      </PageRow>
    </>
  );
};
