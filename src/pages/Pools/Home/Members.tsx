// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { PoolState } from 'contexts/Pools/types';
import { useTheme } from 'contexts/Themes';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper } from 'Wrappers';
import { MembersList } from './MembersList';

export const Members = () => {
  const { network } = useApi();
  const { mode } = useTheme();
  const { getMembersOfPool } = usePoolMembers();
  const { selectedActivePool, isOwner, isStateToggler } = useActivePools();
  const { t } = useTranslation('pages');

  const poolMembers = getMembersOfPool(selectedActivePool?.id ?? 0);
  const poolMembersTitle = `${t('pools.poolMember', {
    count: poolMembers.length,
  })}`;

  const networkColorsSecondary: any = network.colors.secondary;
  const annuncementBorderColor = networkColorsSecondary[mode];

  const showBlockedPrompt =
    selectedActivePool?.bondedPool?.state === PoolState.Block &&
    (isOwner() || isStateToggler());

  return (
    <>
      {/* Pool in Blocked state: allow root & stage toggler to unbond & withdraw members */}
      {showBlockedPrompt && (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
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
        </PageRowWrapper>
      )}

      {/* Pool in Destroying state: allow anyone to unbond & withdraw members */}
      {selectedActivePool?.bondedPool?.state === PoolState.Destroy && (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
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
        </PageRowWrapper>
      )}

      <PageRowWrapper className="page-padding" noVerticalSpacer>
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
      </PageRowWrapper>
    </>
  );
};
