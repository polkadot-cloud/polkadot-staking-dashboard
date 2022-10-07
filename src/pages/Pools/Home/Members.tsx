// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRowWrapper } from 'Wrappers';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'contexts/Themes';
import { PoolState } from 'contexts/Pools/types';
import { useTranslation } from 'react-i18next';
import { MembersList } from './MembersList';

export const Members = () => {
  const { network } = useApi();
  const { mode } = useTheme();
  const { getMembersOfPool } = usePoolMembers();
  const { activeBondedPool, isOwner, isStateToggler } = useActivePool();
  const { t, i18n } = useTranslation('common');

  const poolMembers = getMembersOfPool(activeBondedPool?.id ?? 0);
  const poolMembersTitle =
    i18n.resolvedLanguage === 'en'
      ? `${poolMembers.length} Pool Member${
          poolMembers.length === 1 ? `` : `s`
        }`
      : `${poolMembers.length} 成员`;

  const networkColorsSecondary: any = network.colors.secondary;
  const annuncementBorderColor = networkColorsSecondary[mode];

  const showBlockedPrompt =
    activeBondedPool?.bondedPool?.state === PoolState.Block &&
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
              <h3>{t('pages.pools.pool_currently_locked')}</h3>
              <h4>
                You have permission to unbond and withdraw funds of any pool
                member. Use a member&apos;s menu ({' '}
                <FontAwesomeIcon icon={faBars} transform="shrink-2" /> ) to
                select management options.
              </h4>
            </div>
          </CardWrapper>
        </PageRowWrapper>
      )}

      {/* Pool in Destroying state: allow anyone to unbond & withdraw members */}
      {activeBondedPool?.bondedPool?.state === PoolState.Destroy && (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
          <CardWrapper
            style={{ border: `1px solid ${annuncementBorderColor}` }}
          >
            <div className="content">
              <h3>{t('pages.pools.pool_in_destroying_state')}</h3>
              <h4>
                You have permission to unbond and withdraw funds of any pool
                member. Use a member&apos;s menu ({' '}
                <FontAwesomeIcon icon={faBars} transform="shrink-2" /> ) to
                select management options.
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
