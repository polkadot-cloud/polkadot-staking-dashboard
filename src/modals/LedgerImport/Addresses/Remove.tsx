// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonMono, ButtonMonoInvert } from '@polkadotcloud/dashboard-ui';
import { useConnect } from 'contexts/Connect';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { useOverlay } from 'contexts/Overlay';
import { Identicon } from 'library/Identicon';
import type { ConfirmProps } from './types';
import { ConfirmWrapper } from './Wrappers';

export const Remove = ({ address }: ConfirmProps) => {
  const { forgetAccounts } = useConnect();
  const { setStatus } = useOverlay();
  const { getLedgerAccount, removeLedgerAccount } = useLedgerHardware();

  return (
    <ConfirmWrapper>
      <Identicon value={address} size={60} />
      <h3>Remove Account</h3>
      <h5>{address}</h5>
      <div className="footer">
        <ButtonMonoInvert text="Cancel" onClick={() => setStatus(0)} />
        <ButtonMono
          text="Remove Account"
          onClick={() => {
            const account = getLedgerAccount(address);
            if (account) {
              removeLedgerAccount(address);
              forgetAccounts([account]);
              setStatus(0);
            }
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
