// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useTransferOptions } from 'contexts/TransferOptions';
import Button from 'library/Button';
import { Identicon } from 'library/Identicon';
import OpenHelpIcon from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { Wrapper as StatWrapper } from 'library/Stat/Wrapper';
import React from 'react';
import { determinePoolDisplay } from 'Utils';
import { Wrapper } from './Wrapper';

export const Membership = ({ label }: { label: string }) => {
  const { isReady } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { openModalWith } = useModal();
  const { bondedPools, meta } = useBondedPools();
  const { selectedActivePool, isDepositor, isOwner, isMember, isStateToggler } =
    useActivePools();
  const { getTransferOptions } = useTransferOptions();
  const { t } = useTranslation('common');

  const { active } = getTransferOptions(activeAccount).pool;

  let display = t('pages.pools.not_in_pool');
  if (selectedActivePool) {
    const pool = bondedPools.find((p: any) => {
      return p.addresses.stash === selectedActivePool.addresses.stash;
    });

    if (pool) {
      const metadata = meta.bonded_pools?.metadata ?? [];
      const batchIndex = bondedPools.indexOf(pool);
      display = determinePoolDisplay(
        selectedActivePool.addresses.stash,
        metadata[batchIndex]
      );
    }
  }

  const buttons = [];
  let paddingRight = 0;

  if (isOwner() || isStateToggler()) {
    paddingRight += 8.2;
    buttons.push(
      <Button
        primary
        inline
        title={t('pages.pools.manage')}
        icon={faCog}
        small
        disabled={!isReady || isReadOnlyAccount(activeAccount)}
        onClick={() => openModalWith('ManagePool', {}, 'small')}
      />
    );
  }

  if (isMember() && !isDepositor() && active?.gtn(0)) {
    paddingRight += 7.9;
    buttons.push(
      <Button
        primary
        inline
        title={t('pages.pools.leave')}
        icon={faSignOutAlt}
        small
        disabled={!isReady || isReadOnlyAccount(activeAccount)}
        onClick={() =>
          openModalWith('LeavePool', { bondType: 'pool' }, 'small')
        }
      />
    );
  }

  return (
    <StatWrapper>
      <h4>
        {label} <OpenHelpIcon helpKey="Pool Membership" />
      </h4>
      <Wrapper
        paddingLeft={selectedActivePool !== null}
        paddingRight={paddingRight === 0 ? null : `${String(paddingRight)}rem`}
      >
        <h2 className="hide-with-padding">
          <div className="icon">
            <Identicon
              value={selectedActivePool?.addresses?.stash ?? ''}
              size={26}
            />
          </div>
          {display}
          {buttons.length > 0 && (
            <div className="btn">
              {buttons.map((b: any, i: number) => (
                <React.Fragment key={i}>{b}</React.Fragment>
              ))}
            </div>
          )}
        </h2>
      </Wrapper>
    </StatWrapper>
  );
};
