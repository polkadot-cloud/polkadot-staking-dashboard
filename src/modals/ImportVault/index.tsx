// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { ButtonText } from '@polkadotcloud/core-ui';
import { ReactComponent as Icon } from 'img/polkadotVault.svg';
import { Heading } from 'library/Import/Heading';
import { StatusBar } from 'library/Import/StatusBar';
import { AddressesWrapper } from 'library/Import/Wrappers';
import { useState } from 'react';

export const ImportVault = () => {
  const addresses = [];

  // Store whether an import is in progress.
  const [importing, setImporting] = useState<boolean>(false);

  return (
    <>
      <Heading
        title="Polkadot Vault"
        disabled={!addresses.length}
        handleReset={() => {
          /* TODO: Reset */
        }}
      />
      <AddressesWrapper>
        <div className="more">
          <ButtonText
            iconLeft={faQrcode}
            text="Import An Account"
            disabled={importing}
            onClick={async () => {
              setImporting(true);
            }}
          />
        </div>
      </AddressesWrapper>

      <StatusBar
        StatusBarIcon={Icon}
        text="No Accounts Imported"
        helpKey={undefined}
        inProgress={false}
        handleCancel={() => {}}
      />
    </>
  );
};
