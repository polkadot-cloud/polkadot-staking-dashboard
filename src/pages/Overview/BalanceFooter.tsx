// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimaryInvert, Separator } from '@polkadotcloud/core-ui';
import { MoreWrapper } from './Wrappers';

export const BalanceFooter = () => {
  return (
    <MoreWrapper>
      <Separator />
      <h4>Other Balances</h4>
      <section>
        <ButtonPrimaryInvert
          iconLeft={faGlobe}
          lg
          disabled={false}
          text="Manage"
        />
      </section>
    </MoreWrapper>
  );
};
