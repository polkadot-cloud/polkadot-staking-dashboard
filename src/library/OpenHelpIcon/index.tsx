// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ReactComponent as IconSVG } from 'img/info-outline.svg';
import { useHelp } from 'contexts/Help';
import { Wrapper } from './Wrapper';
import { OpenHelpIconProps } from './types';

export const OpenHelpIcon = (props: OpenHelpIconProps) => {
  const { openHelpWith } = useHelp();

  const { key } = props;

  const size = props.size ?? '1.3em';

  return (
    <Wrapper
      onClick={() => {
        openHelpWith(key, {});
      }}
      style={{ width: size, height: size }}
    >
      <IconSVG />
    </Wrapper>
  );
};

export default OpenHelpIcon;
