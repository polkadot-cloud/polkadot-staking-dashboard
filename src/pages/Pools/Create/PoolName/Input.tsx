// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveAccounts } from 'contexts/ActiveAccounts';

export const Input = ({
  listenIsValid,
  defaultValue,
  setters = [],
  value = 0,
}: any) => {
  const { t } = useTranslation('pages');
  const { activeAccount } = useActiveAccounts();

  // the current local bond value
  const [metadata, setMetadata] = useState(value);

  // handle change for bonding
  const handleChange = (e: any) => {
    const val = e.target.value;
    listenIsValid(val !== '');
    setMetadata(val);

    // apply value to parent setters
    for (const s of setters) {
      s.set({
        ...s.current,
        metadata: val,
      });
    }
  };

  // reset value to default when changing account
  useEffect(() => {
    setMetadata(defaultValue ?? '');
  }, [activeAccount]);

  return (
    <>
      <div style={{ margin: '1rem 0' }}>
        <input
          className="textbox"
          style={{ width: '100%', fontFamily: 'InterSemiBold, sans-serif' }}
          placeholder={t('pools.poolName')}
          type="text"
          onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(e)}
          value={metadata ?? ''}
        />
      </div>
      <p>{t('pools.poolNameSupport')}</p>
    </>
  );
};
