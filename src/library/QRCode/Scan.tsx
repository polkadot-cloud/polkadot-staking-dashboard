// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useCallback, useMemo } from 'react';
import Reader from 'react-qr-reader';
import { ScanWrapper } from './Wrappers.js';
import type { ScanProps } from './types.js';
import { createImgSize } from './util.js';

const DEFAULT_DELAY = 150;

const DEFAULT_ERROR = (error: Error): void => {
  throw new Error(error.message);
};

const Scan = ({
  className = '',
  delay = DEFAULT_DELAY,
  onError = DEFAULT_ERROR,
  onScan,
  size,
  style = {},
}: ScanProps): React.ReactElement<ScanProps> => {
  const containerStyle = useMemo(() => createImgSize(size), [size]);

  const onErrorCallback = useCallback(
    (error: Error) => onError(error),
    [onError]
  );

  const onScanCallback = useCallback(
    (data: string | null) => data && onScan(data),
    [onScan]
  );

  return (
    <ScanWrapper className={className} style={containerStyle}>
      <Reader
        className="ui--qr-Scan"
        delay={delay}
        onError={onErrorCallback}
        onScan={onScanCallback}
        style={style}
      />
    </ScanWrapper>
  );
};

export const QrScan = React.memo(Scan);
