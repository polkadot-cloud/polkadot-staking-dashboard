// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const LoaderWrapper = styled.div`
  background: var(--shimmer-foreground);
  background-image: linear-gradient(
    to right,
    var(--shimmer-foreground) 0%,
    var(--shimmer-background) 20%,
    var(--shimmer-foreground) 40%,
    var(--shimmer-foreground) 100%
  );
  background-repeat: no-repeat;
  background-size: 60% 100%;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer-loader;
  animation-timing-function: linear;

  opacity: 0.1;
  border-radius: 0.75rem;
  display: inline-block;
  position: relative;

  @keyframes shimmer-loader {
    0% {
      background-position: 0px 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;
