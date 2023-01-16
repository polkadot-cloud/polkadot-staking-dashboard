// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { useTranslation } from 'react-i18next';
import { Account } from '../Account';
import { HeadingWrapper } from './Wrappers';

export const Connected = () => {
  const { activeAccount, accountHasSigner } = useConnect();
  const { t } = useTranslation('library');

  return (
    <>
      {activeAccount ? (
        <>
          {/* default account display / stash label if actively nominating */}
          <HeadingWrapper>
            <Account
              canClick={false}
              value={activeAccount}
              readOnly={!accountHasSigner(activeAccount)}
              label={undefined}
              format="name"
              filled
            />
          </HeadingWrapper>
        </>
      ) : null}
    </>
  );
};
