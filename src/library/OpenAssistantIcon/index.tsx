// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ReactComponent as IconSVG } from 'img/assistant.svg';
import { useHelp } from 'contexts/Help';
import { Wrapper } from './Wrapper';
import { OpenAssistantIconProps } from './types';

export const OpenAssistantIcon = (props: OpenAssistantIconProps) => {
  const { openHelpWith } = useHelp();

  const { title } = props;

  const size = props.size ?? '1.3em';

  return (
    <Wrapper
      className="assistant-icon ignore-assistant-outside-alerter"
      onClick={() => {
        openHelpWith(title, {});
      }}
      style={{ width: size, height: size }}
    >
      <IconSVG className="ignore-assistant-outside-alerter" />
    </Wrapper>
  );
};

export default OpenAssistantIcon;
