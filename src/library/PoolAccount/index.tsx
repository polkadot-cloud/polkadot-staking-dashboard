// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useApi } from 'contexts/Api';
import { APIContextInterface } from 'types/api';
import { usePools } from 'contexts/Pools';
import { useTheme } from 'contexts/Themes';
import { defaultThemes } from 'theme/default';
import { ReactComponent as WalletSVG } from 'img/wallet.svg';
import Identicon from 'library/Identicon';
import { useConnect } from 'contexts/Connect';
import { ConnectContextInterface } from 'types/connect';
import Wrapper from './Wrapper';
import { clipAddress, convertRemToPixels } from '../../Utils';

export const PoolAccount = (props: any) => {
  const { mode } = useTheme();
  const { isReady } = useApi() as APIContextInterface;
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { fetchPoolsMetaBatch, meta } = usePools();

  const { label }: any = props;

  // is this the initial fetch
  const [fetched, setFetched] = useState(false);

  const batchKey = 'pool_header';

  // refetch when pool or active account changes
  useEffect(() => {
    setFetched(false);
  }, [activeAccount, props.pool]);

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
    const pools: any = [{ id: props.pool.id }];
    // console.log('fetching');
    fetchPoolsMetaBatch(batchKey, pools, true);
  };

  const filled = props.filled ?? false;
  const fontSize = props.fontSize ?? '1rem';
  const wallet = props.wallet ?? false;
  const { canClick }: { canClick: boolean } = props;

  const metaBatch = meta[batchKey];
  const metaData = metaBatch?.metadata?.[0];
  const syncing = metaData === undefined;

  // fallback to address on empty metadata string
  const display =
    ? 'Syncing...'
    : metaData !== ''
    ? metaData
    : clipAddress(props.pool.addresses.stash);

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
          value={props.pool.addresses.stash}
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
