// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';
import React, { useCallback } from 'react';
import { QrScan } from './Scan.js';

interface ScanType {
  signature: HexString;
}

interface Props {
  className?: string;
  onError?: (error: Error) => void;
  onScan: (scanned: ScanType) => void;
  size?: string | number;
  style?: React.CSSProperties;
}

const ScanSignature = ({
  className,
  onError,
  onScan,
  size,
  style,
}: Props): React.ReactElement<Props> => {
  const _onScan = useCallback(
    (signature: string | null) =>
      signature && onScan({ signature: `0x${signature}` }),
    [onScan]
  );

  return (
    <QrScan
      className={className}
      onError={onError}
      onScan={_onScan}
      size={size}
      style={style}
    />
  );
};

export const QrScanSignature = React.memo(ScanSignature);
