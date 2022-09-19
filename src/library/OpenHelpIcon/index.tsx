// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ReactComponent as IconSVG } from 'img/assistant.svg';
import { useHelp } from 'contexts/Help';
import { Wrapper } from './Wrapper';
import { OpenHelpIconProps } from './types';

export const OpenHelpIcon = (props: OpenHelpIconProps) => {
  const { openHelpWith } = useHelp();

  const { key } = props;

  const size = props.size ?? '1.3em';

  return (
    <Wrapper
      className="help-icon ignore-assistant-outside-alerter"
      onClick={() => {
        openHelpWith(key, {});
      }}
      style={{ width: size, height: size }}
    >
      <IconSVG className="ignore-assistant-outside-alerter" />
    </Wrapper>
  );
};

export default OpenHelpIcon;
