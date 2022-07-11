// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useAssistant } from 'contexts/Assistant';
import { ReactComponent as IconSVG } from 'img/assistant.svg';
import { Wrapper } from './Wrapper';
import { OpenAssistantIconProps } from './types';

export const OpenAssistantIcon = (props: OpenAssistantIconProps) => {
  const { goToDefinition } = useAssistant();

  const { page, title } = props;

  const size = props.size ?? '1.3em';

  return (
    <Wrapper
      className="assistant-icon "
      onClick={() => {
        goToDefinition(page, title);
      }}
      style={{ width: size, height: size }}
    >
      <IconSVG className="ignore-assistant-outside-alerter" />
    </Wrapper>
  );
};

export default OpenAssistantIcon;
