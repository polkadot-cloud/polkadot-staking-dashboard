// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { QrDisplayPayload } from '@polkadot/react-qr';
import { useConnect } from 'contexts/Connect';
import { useTxMeta } from 'contexts/TxMeta';
import { QRVieweraWrapper } from 'library/Import/Wrappers';

export const SignOverlay = () => {
  const { activeAccount } = useConnect();
  const { getTxPayload } = useTxMeta();
  const payload = getTxPayload();
  const payloadU8a = payload?.toU8a();

  return (
    <QRVieweraWrapper>
      <h3 className="title">Sign From Polkadot Vault</h3>
      <div className="viewer withBorder">
        <QrDisplayPayload
          address={activeAccount || ''}
          cmd={2}
          genesisHash={payload?.genesisHash}
          payload={payloadU8a}
          style={{ width: '100%', maxWidth: 250 }}
        />
        {/* <QrScanSignature
        size={300}
        onScan={(signature) => {
        }}
      /> */}
      </div>
    </QRVieweraWrapper>
  );
};
