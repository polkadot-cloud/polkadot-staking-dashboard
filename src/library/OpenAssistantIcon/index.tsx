// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useAssistant } from '../../contexts/Assistant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Wrapper } from './Wrapper';

export const OpenAssistantIcon = (props: any) => {

  const { goToDefinition } = useAssistant();

  const { page, title } = props;

  return (
    <Wrapper onClick={() => {
      goToDefinition(page, title);
    }}>
      <FontAwesomeIcon transform='grow-3' icon={faInfoCircle} />
    </Wrapper>
  )
}

export default OpenAssistantIcon;