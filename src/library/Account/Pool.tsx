// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { ellipsisFn } from '@polkadot-cloud/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { AccountCard } from '@polkadot-cloud/react';
import type { IconProps } from '@polkadot-cloud/react/recipes/AccountCard';
import { Wrapper } from './Wrapper';
import type { AccountProps } from './types';

export const Account = ({
  label,
  pool,
  onClick,
  canClick,
  fontSize = '1.05rem',
}: AccountProps) => {
  const { t } = useTranslation('library');
  const { isReady } = useApi();
  const { activeAccount } = useConnect();
  const { fetchPoolsMetaBatch, meta } = useBondedPools();

  // is this the initial fetch
  const [fetched, setFetched] = useState(false);

  const batchKey = 'pool_header';

  // refetch when pool or active account changes
  useEffect(() => {
    setFetched(false);
  }, [activeAccount, pool]);

  // configure pool list when network is ready to fetch
  useEffect(() => {
    if (isReady) {
      setFetched(true);

      if (!fetched) {
        getPoolMeta();
      }
    }
  }, [isReady, fetched]);

  // handle pool list bootstrapping
  const getPoolMeta = () => {
    const pools: any = [{ id: pool.id }];
    fetchPoolsMetaBatch(batchKey, pools, true);
  };

  const metaBatch = meta[batchKey];
  const metaData = metaBatch?.metadata?.[0];
  const syncing = metaData === undefined;

  // display value
  const defaultDisplay = ellipsisFn(pool.addresses.stash);
  let display = syncing ? t('syncing') : metaData ?? defaultDisplay;

  // check if super identity has been byte encoded
  const displayAsBytes = u8aToString(u8aUnwrapBytes(display));
  if (displayAsBytes !== '') {
    display = displayAsBytes;
  }
  // if still empty string, default to clipped address
  if (display === '') {
    display = defaultDisplay;
  }

  const iconProps: IconProps = {
    size: 15,
    gridSize: 1,
    justify: 'flex-start',
  };

  const syncArgs = !syncing
    ? {
        icon: iconProps,
      }
    : {};

  return (
    <Wrapper $canClick={canClick} $fontSize={fontSize} onClick={onClick}>
      <AccountCard
        noCard
        fontSize="1rem"
        title={{
          address: pool.addresses.stash,
          name: display || '',
          justify: 'flex-start',
        }}
        extraComponent={{
          component:
            label !== undefined ? (
              <div className="account-label">{label}</div>
            ) : undefined,
          gridSize: 2,
        }}
        {...syncArgs}
      />
    </Wrapper>
  );
};
