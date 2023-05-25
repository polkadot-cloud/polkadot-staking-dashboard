// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { QrDisplayPayload, QrScanSignature } from '@polkadot/react-qr';
import { ButtonPrimary, ButtonSecondary } from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import { useOverlay } from 'contexts/Overlay';
import { useTxMeta } from 'contexts/TxMeta';
import { QRVieweraWrapper } from 'library/Import/Wrappers';
import { useState } from 'react';
import type { AnyJson } from 'types';

export const SignOverlay = () => {
  const { activeAccount } = useConnect();
  const { getTxPayload, setTxSignature } = useTxMeta();
  const payload = getTxPayload();
  const payloadU8a = payload?.toU8a();
  const { setStatus: setOverlayStatus } = useOverlay();

  // Whether user is on sign or submit stage.
  const [stage, setStage] = useState(1);

  // TODO: set signature on successful scan.
  //  setTxSignature(body.sig);

  return (
    <QRVieweraWrapper>
      {stage === 1 && <h3 className="title">Sign in Polkadot Vault</h3>}
      {stage === 2 && (
        <h3 className="title">Scan Signature From Polkadot Vault</h3>
      )}

      <div className="progress">
        <span className={stage === 1 ? 'active' : undefined}>Sign</span>
        <FontAwesomeIcon
          icon={faChevronRight}
          transform="shrink-4"
          className="arrow"
        />
        <span className={stage === 2 ? 'active' : undefined}>Scan</span>
      </div>
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
          <QrScanSignature
            size={279}
            onScan={(signature: AnyJson) => {
              console.log(signature);
              // setTxSignature(signature);
            }}
          />
        </div>
      )}
      <div className="foot">
        <div>
          {stage === 2 && (
            <ButtonSecondary
              text="Back to Sign"
              lg
              onClick={() => setStage(1)}
              iconLeft={faChevronLeft}
              iconTransform="shrink-3"
            />
          )}
          {stage === 1 && (
            <ButtonPrimary
              text="I have Signed"
              lg
              onClick={() => {
                setStage(2);
              }}
              iconRight={faChevronRight}
              iconTransform="shrink-3"
            />
          )}
          <ButtonSecondary
            text="Cancel"
            lg
            marginLeft
            onClick={() => setOverlayStatus(0)}
          />
        </div>
      </div>
    </QRVieweraWrapper>
  );
};
