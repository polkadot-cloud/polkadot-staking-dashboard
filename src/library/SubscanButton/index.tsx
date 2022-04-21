// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div <any>`
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 0.9rem;
  font-variation-settings: 'wght' 570;
  background: #d33079;
  border-radius: 0.3rem;
  padding: 0.25rem 0.4rem;
  color: #fff;
  opacity: 0.8;
`;

export const SubscanButton = () => {

  return (
    <Wrapper>
      <FontAwesomeIcon
        icon={faProjectDiagram}
        transform="shrink-2"
        style={{ marginRight: '0.3rem' }}
      />
      Subscan
    </Wrapper>
  )
}

export default SubscanButton;