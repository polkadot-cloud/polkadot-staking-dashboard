// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { ellipsisFn, remToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { Polkicon } from '@polkadot-cloud/react';
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
  const { poolsMetaData } = useBondedPools();

  const syncing = !Object.values(poolsMetaData).length;

  // display value
  const defaultDisplay = ellipsisFn(pool.addresses.stash);
  let display = syncing
    ? t('syncing')
    : poolsMetaData[pool.id] ?? defaultDisplay;

  // check if super identity has been byte encoded
  const displayAsBytes = u8aToString(u8aUnwrapBytes(display));
  if (displayAsBytes !== '') {
    display = displayAsBytes;
  }
  // if still empty string, default to clipped address
  if (display === '') {
    display = defaultDisplay;
  }

  return (
    <Wrapper $canClick={canClick} $fontSize={fontSize} onClick={onClick}>
      {label !== undefined && <div className="account-label">{label}</div>}

      <span className="identicon">
        <Polkicon
          address={pool.addresses.stash}
          size={remToUnit(fontSize) * 1.4}
        />
      </span>
      <span className={`title${syncing === true ? ` syncing` : ``}`}>
        {display}
      </span>
    </Wrapper>
  );
};
