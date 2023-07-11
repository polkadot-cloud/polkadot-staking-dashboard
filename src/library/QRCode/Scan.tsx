/* @license Copyright 2023 @paritytech/polkadot-dashboard-ui authors & contributors
SPDX-License-Identifier: Apache-2.0 */

import React, { useCallback, useMemo } from 'react';
import Reader from 'react-qr-reader';
import styled from 'styled-components';
import { createImgSize } from './util';

interface Props {
  className?: string | undefined;
  delay?: number;
  onError?: undefined | ((error: Error) => void);
  onScan: (data: string) => void;
  size?: string | number | undefined;
  style?: React.CSSProperties | undefined;
}

const DEFAULT_DELAY = 150;

const DEFAULT_ERROR = (error: Error): void => {
  console.error('@polkadot/react-qr:Scan', error.message);
};

const Scan = ({
  className = '',
  delay = DEFAULT_DELAY,
  onError = DEFAULT_ERROR,
  onScan,
  size,
  style = {},
}: Props): React.ReactElement<Props> => {
  const containerStyle = useMemo(() => createImgSize(size), [size]);

  const _onError = useCallback((error: Error) => onError(error), [onError]);

  const _onScan = useCallback(
    (data: string | null) => data && onScan(data),
    [onScan]
  );

  return (
    <StyledDiv className={className} style={containerStyle}>
      <Reader
        className="ui--qr-Scan"
        delay={delay}
        onError={_onError}
        onScan={_onScan}
        style={style}
      />
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  .ui--qr-Scan {
    display: inline-block;
    height: 100%;
    transform: matrix(-1, 0, 0, 1, 0, 0);
    width: 100%;

    video {
      margin: 0;
    }
  }
`;

export const QrScan = React.memo(Scan);
