// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { BondedPool } from 'contexts/Pools/types';
import Identicon from 'library/Identicon';
import { Title } from 'library/Modal/Title';
import { useStatusButtons } from 'pages/Pools/Home/Status/useStatusButtons';
import { useTranslation } from 'react-i18next';
import { PaddingWrapper } from '../Wrappers';
import { ContentWrapper, StyledButton } from './Wrappers';

export const AccountPoolRoles = () => {
  const { config } = useModal();
  const { getAccountPools } = useBondedPools();
  const { membership } = usePoolMemberships();
  const { who } = config;
  const { t } = useTranslation('common');

  const accountPools = getAccountPools(who);
  const totalAccountPools = Object.entries(accountPools).length;
  const { label } = useStatusButtons();

  return (
    <>
      <Title title={t('modals.all_pool_roles')} icon={faBars} />
      <PaddingWrapper>
        <ContentWrapper>
          {membership && (
            <>
              <h4>{label}</h4>
              <div className="items">
                <Button item={['member']} poolId={String(membership.poolId)} />
              </div>
            </>
          )}
          <h4>
            {t('modals.active_roles', {
              count: totalAccountPools,
            })}
          </h4>
          <div className="items">
            {Object.entries(accountPools).map(([key, item]: any, i: number) => (
              <Button item={item} poolId={key} key={`all_roles_root_${i}`} />
            ))}
          </div>
        </ContentWrapper>
      </PaddingWrapper>
    </>
  );
};

const Button = ({ item, poolId }: { item: Array<string>; poolId: string }) => {
  const { setStatus } = useModal();
  const { bondedPools } = useBondedPools();
  const { setSelectedPoolId } = useActivePools();
  const { t } = useTranslation('common');

  const pool = bondedPools.find((b: BondedPool) => String(b.id) === poolId);
  const stash = pool?.addresses?.stash || '';

  return (
    <StyledButton
      disabled={false}
      type="button"
      className="action-button"
      onClick={() => {
        setSelectedPoolId(poolId);
        setStatus(2);
      }}
    >
      <div className="icon">
        <Identicon value={stash} size={30} />
      </div>

      <div className="details">
        <h3>
          {t('modals.pool')} {poolId}
        </h3>
        <h4>
          {item.includes('root') && <span>{t('modals.root')}</span>}
          {item.includes('nominator') && <span>{t('modals.nominator')}</span>}
          {item.includes('stateToggler') && (
            <span>{t('modals.state_toggler')}</span>
          )}
        </h4>
      </div>
      <div>
        <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
      </div>
    </StyledButton>
  );
};

export default AccountPoolRoles;
