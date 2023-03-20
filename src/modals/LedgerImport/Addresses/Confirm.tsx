// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonMono, ButtonMonoInvert } from '@polkadotcloud/dashboard-ui';
import { useConnect } from 'contexts/Connect';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { useOverlay } from 'contexts/Overlay';
import { Identicon } from 'library/Identicon';
import { ConfirmWrapper } from './Wrappers';
import type { ConfirmProps } from './types';

export const Confirm = ({ address, index }: ConfirmProps) => {
  const { addToAccounts } = useConnect();
  const { setStatus } = useOverlay();
  const { addLedgerAccount } = useLedgerHardware();

  return (
    <ConfirmWrapper>
      <Identicon value={address} size={60} />
      <h3>Import Account</h3>
      <h5>{address}</h5>
      <div className="footer">
        <ButtonMonoInvert text="Cancel" onClick={() => setStatus(0)} />
        <ButtonMono
          text="Import Account"
          onClick={() => {
            const account = addLedgerAccount(address, index);
            if (account) {
              addToAccounts([account]);
            }
            setStatus(0);
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
