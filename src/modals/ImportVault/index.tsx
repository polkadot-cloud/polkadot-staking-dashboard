// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { ButtonText } from '@polkadotcloud/core-ui';
import { useOverlay } from 'contexts/Overlay';
import { ReactComponent as Icon } from 'img/polkadotVault.svg';
import { Heading } from 'library/Import/Heading';
import { StatusBar } from 'library/Import/StatusBar';
import { AddressesWrapper } from 'library/Import/Wrappers';
import { Reader } from './Reader';

export const ImportVault = () => {
  const { openOverlayWith, status: overlayStatus } = useOverlay();

  const addresses = [];

  return (
    <>
      <Heading title="Polkadot Vault" disabled={!addresses.length} />
      <AddressesWrapper>
        <div className="more">
          <ButtonText
            iconLeft={faQrcode}
            text="Import An Account"
            disabled={overlayStatus !== 0}
            onClick={async () => {
              openOverlayWith(<Reader />, 'small');
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
