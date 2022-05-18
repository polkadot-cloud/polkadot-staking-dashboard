// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper } from './Wrapper';
import { useAssistant } from '../../contexts/Assistant';
import { ReactComponent as IconSVG } from '../../img/assistant.svg';

export const OpenAssistantIcon = (props: any) => {
  const { goToDefinition } = useAssistant();

  const { page, title } = props;

  const size = props.size ?? '1.3em';

  return (
    <Wrapper
      className="assistant-icon ignore-assistant-outside-alerter"
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
