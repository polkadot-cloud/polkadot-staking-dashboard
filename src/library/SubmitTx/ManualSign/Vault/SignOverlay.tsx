// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { QrDisplayPayload } from '@polkadot/react-qr';
import { useConnect } from 'contexts/Connect';
import { useTxMeta } from 'contexts/TxMeta';
import { QRVieweraWrapper } from 'library/Import/Wrappers';
import { useState } from 'react';

export const SignOverlay = () => {
  const { activeAccount } = useConnect();
  const { getTxPayload } = useTxMeta();
  const payload = getTxPayload();
  const payloadU8a = payload?.toU8a();

  // Whether user is on sign or submit stage.
  const [stage, setStage] = useState(1);

  // TODO: set signature on successful scan.
  //  setTxSignature(body.sig);

  return (
    <QRVieweraWrapper>
      <h3 className="title">Sign From Polkadot Vault</h3>
      {stage === 1 && (
        <div className="viewer withBorder">
          <QrDisplayPayload
            address={activeAccount || ''}
            cmd={2}
            genesisHash={payload?.genesisHash}
            payload={payloadU8a}
            style={{ width: '100%', maxWidth: 250 }}
          />
        </div>
      )}
      {stage === 2 && (
        <div className="viewer">
          {/* <QrScanSignature
            size={300}
            onScan={(signature) => {
            }}
          /> */}
        </div>
      )}
      <div className="foot">{/* TODO: buttons */}</div>
    </QRVieweraWrapper>
  );
};
