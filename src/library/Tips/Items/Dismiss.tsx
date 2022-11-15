// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  ButtonPrimary,
  ButtonSecondary,
} from '@rossbulat/polkadot-dashboard-ui';
import { useTips } from 'contexts/Tips';
import { useUi } from 'contexts/UI';
import { TipWrapper } from '../Wrappers';

export const Dismiss = () => {
  const { closeTip } = useTips();
  const { toggleService } = useUi();

  return (
    <TipWrapper>
      <div>
        <h1>Dismiss Tips</h1>
      </div>
      <div>
        <h4>Dismissing tips will remove them from your overview.</h4>
        <h4>
          Tips can be turned re-enabled from dashboard settings, that can be
          accessed via the cog icon in the bottom left corner of the side menu.
        </h4>
        <div className="buttons">
          <ButtonPrimary
            marginRight
            text="Disable Dashboard Tips"
            onClick={() => {
              toggleService('tips');
              closeTip();
            }}
          />
          <ButtonSecondary text="Cancel" onClick={() => closeTip()} />
        </div>
      </div>
    </TipWrapper>
  );
};
