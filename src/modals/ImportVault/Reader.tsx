// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonPrimary, ButtonSecondary } from '@polkadotcloud/core-ui';
import { isValidAddress } from '@polkadotcloud/utils';
import { useOverlay } from 'contexts/Overlay';
import { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { QRCameraWrapper } from './Wrappers';

export const Reader = () => {
  const { setStatus: setOverlayStatus } = useOverlay();

  // Store data from QR Code scanner.
  const [qrData, setQrData] = useState<any>(undefined);

  // Store QR data feedback.
  const [feedback, setFeedback] = useState<string>('');

  const handleQrData = (data: any) => {
    const text = data?.text || '';
    const address = text.split(':')?.[1] || '';
    setQrData(address);
  };

  // Reset QR data on open.
  useEffect(() => {
    setQrData(undefined);
  }, []);

  // Re-render on QR data received.
  useEffect(() => {
    setFeedback(
      qrData === undefined
        ? 'Waiting for QR Code'
        : isValidAddress(qrData)
        ? 'Address Received'
        : 'Invalid Address'
    );
  }, [qrData]);

  return (
    <QRCameraWrapper>
      <h3 className="title">Import From Polkadot Vault</h3>
      <div className="viewer">
        <FontAwesomeIcon icon={faCamera} className="ph" />
        <QrReader
          onResult={(result, error) => {
            if (result) {
              handleQrData(result);
            }
            if (error) {
              // console.info(error);
            }
          }}
          constraints={{ facingMode: 'user' }}
          className="reader"
          containerStyle={{
            paddingTop: '75% !important',
            top: 0,
          }}
        />
      </div>
      <div className="foot">
        <h3>{feedback}</h3>
        <div>
          <ButtonPrimary text="Import Address" disabled marginRight />
          <ButtonSecondary text="Cancel" onClick={() => setOverlayStatus(0)} />
        </div>
      </div>
    </QRCameraWrapper>
  );
};
