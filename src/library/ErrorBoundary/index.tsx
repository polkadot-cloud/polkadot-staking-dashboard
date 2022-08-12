// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <div>
    <h1>Opps, Something Went Wrong:</h1>
    <pre>{error.message}</pre>
    <button type="button" onClick={resetErrorBoundary}>
      Click to reload!
    </button>
  </div>
);
