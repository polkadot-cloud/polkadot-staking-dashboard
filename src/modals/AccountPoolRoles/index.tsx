// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { ButtonOption, ModalPadding, Polkicon } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { Title } from 'library/Modal/Title';
import { useStatusButtons } from 'pages/Pools/Home/Status/useStatusButtons';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { ContentWrapper } from './Wrappers';

export const AccountPoolRoles = () => {
  const { t } = useTranslation('modals');
  const { options } = useOverlay().modal.config;
  const { getAccountPools } = useBondedPools();
  const { membership } = usePoolMemberships();
  const { who } = options;
  const accountPools = getAccountPools(who);
  const totalAccountPools = Object.entries(accountPools).length;
  const { label } = useStatusButtons();

  return (
    <>
      <Title title={t('allPoolRoles')} icon={faBars} />
      <ModalPadding>
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
            {t('activeRoles', {
              count: totalAccountPools,
            })}
          </h4>
          <div className="items">
            {Object.entries(accountPools).map(([key, item], i: number) => (
              <Button
                item={item as string[]}
                poolId={key}
                key={`all_roles_root_${i}`}
              />
            ))}
          </div>
        </ContentWrapper>
      </ModalPadding>
    </>
  );
};

const Button = ({ item, poolId }: { item: string[]; poolId: string }) => {
  const { t } = useTranslation('modals');
  const { setModalStatus } = useOverlay().modal;
  const { bondedPools } = useBondedPools();
  const { setSelectedPoolId } = useActivePools();
  const pool = bondedPools.find((b) => String(b.id) === poolId);
  const stash = pool?.addresses?.stash || '';

  return (
    <ButtonOption
      content
      disabled={false}
      onClick={() => {
        setSelectedPoolId(poolId);
        setModalStatus('closing');
      }}
    >
      <div className="icon">
        <Polkicon address={stash} size={30} />
      </div>

      <div className="details">
        <h3>
          {t('pool')} {poolId}
        </h3>
        <h4>
          {item.includes('root') ? <span>{t('root')}</span> : null}
          {item.includes('nominator') ? <span>{t('nominator')}</span> : null}
          {item.includes('bouncer') ? <span>{t('bouncer')}</span> : null}
        </h4>
      </div>
    </ButtonOption>
  );
};
