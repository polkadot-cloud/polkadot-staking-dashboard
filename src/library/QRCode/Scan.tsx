// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactElement } from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScanWrapper } from './Wrappers.js';
import type { ScanProps } from './types.js';
import { createImgSize } from './util.js';
import { Html5Qrcode } from 'html5-qrcode';

const DEFAULT_ERROR = (error: string): void => {
  throw new Error(error);
};

const QrScanInner = ({
  className = '',
  onError = DEFAULT_ERROR,
  onScan,
  size,
}: ScanProps): ReactElement<ScanProps> => {
  const containerStyle = useMemo(() => createImgSize(size), [size]);

  const onErrorCallback = useCallback(
    (error: string) => onError(error),
    [onError]
  );

  const onScanCallback = useCallback(
    (data: string | null) => data && onScan(data),
    [onScan]
  );

  return (
    <ScanWrapper className={className} style={containerStyle}>
      <Html5QrCodePlugin
        fps={10}
        qrCodeSuccessCallback={onScanCallback}
        qrCodeErrorCallback={onErrorCallback}
      />
    </ScanWrapper>
  );
};

export const QrScan = memo(QrScanInner);

interface Html5QrScannerProps {
  fps: number;
  qrCodeSuccessCallback: (data: string | null) => void;
  qrCodeErrorCallback: (error: string) => void;
}

export const Html5QrCodePlugin = ({
  fps,
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
}: Html5QrScannerProps) => {
  // Store the HTML QR Code instance.
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);

  // Reference of the HTML element used to scan the QR code.
  const ref = useRef<HTMLDivElement>(null);

  const handleHtmlQrCode = (): void => {
    if (!ref.current) {
      return;
    }

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const cameraId = devices[0].id;

          html5QrCode
            ?.start(
              cameraId,
              {
                fps,
              },
              (decodedText) => {
                // do something when code is read
                qrCodeSuccessCallback(decodedText);
              },
              (errorMessage) => {
                // parse error
                qrCodeErrorCallback(errorMessage);
              }
            )
            .catch((err) => {
              console.error(err);
            });
        } else {
          // TODO: display error if no camera devices are available.
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (ref.current) {
      // Instantiate Html5Qrcode once DOM element exists.
      setHtml5QrCode(new Html5Qrcode(ref.current.id));

      // Cleanup function when component will unmount.
      return () => {
        if (html5QrCode) {
          html5QrCode
            .stop()
            .then(() => {
              // QR code scanning is stopped
            })
            .catch((err) => {
              console.error(err);
            });
        }
      };
    }
  }, []);

  // Start QR scanner when API object is instantiated.
  useEffect(() => {
    handleHtmlQrCode();
  }, [html5QrCode]);

  return <div ref={ref} id="html5qr-code-full-region" />;
};
