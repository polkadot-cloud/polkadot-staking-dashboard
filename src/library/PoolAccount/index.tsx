// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useApi } from 'contexts/Api';
import { APIContextInterface } from 'types/api';
import { usePools } from 'contexts/Pools';
import Identicon from '../Identicon';
import Wrapper from './Wrapper';
import { clipAddress, convertRemToPixels } from '../../Utils';
import { useTheme } from '../../contexts/Themes';
import { defaultThemes } from '../../theme/default';
import { ReactComponent as WalletSVG } from '../../img/wallet.svg';

export const PoolAccount = (props: any) => {
  const { mode } = useTheme();
  const { isReady } = useApi() as APIContextInterface;
  const { fetchPoolsMetaBatch, meta } = usePools();

  const { label }: any = props;

  const [pool, setPool] = useState(props.pool);

  // is this the initial fetch
  const [fetched, setFetched] = useState(false);

  const batchKey = 'pool_header';

  // refetch list when pool changes
  useEffect(() => {
    if (props.pool !== pool) {
      setFetched(false);
    }
    setFetched(false);
  }, [props.pool]);

  // configure pool list when network is ready to fetch
  useEffect(() => {
    if (isReady && !fetched) {
      getPoolMeta();
    }
  }, [isReady, fetched]);

  // handle pool list bootstrapping
  const getPoolMeta = () => {
    setPool(props.pool);
    setFetched(true);
    const pools: any = [{ id: props.pool.id }];

    fetchPoolsMetaBatch(batchKey, pools, true);
  };

  const filled = props.filled ?? false;
  const fontSize = props.fontSize ?? '1rem';
  const wallet = props.wallet ?? false;
  const { canClick }: { canClick: boolean } = props;

  const metaBatch = meta[batchKey];
  const metaData = metaBatch?.metadata?.[0];
  const syncing = meta[batchKey]?.metadata === undefined;

  // fallback to address on empty metadata string
  const display = syncing
    ? 'Syncing...'
    : metaData !== ''
    ? metaData
    : clipAddress(pool.addresses.stash);

  return (
    <Wrapper
      whileHover={{ scale: 1.01 }}
      onClick={props.onClick}
      cursor={canClick ? 'pointer' : 'default'}
      fill={filled ? defaultThemes.buttons.secondary.background[mode] : 'none'}
      fontSize={fontSize}
    >
      {label !== undefined && <div className="account-label">{label}</div>}

      <span className="identicon">
        <Identicon
          value={pool.addresses.stash}
          size={convertRemToPixels(fontSize) * 1.45}
        />
      </span>
      <span className={`title${syncing === true && ` syncing`}`}>
        {display}
      </span>

      {wallet && (
        <div className="wallet">
          <WalletSVG />
        </div>
      )}
    </Wrapper>
  );
};
