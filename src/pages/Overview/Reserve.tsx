// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { SectionWrapper, Separator } from './Wrappers';

export const Reserve = () => {
  return (
    <SectionWrapper>
      <Separator />
      <h4>
        Reserve Balance
        <OpenAssistantIcon page="overview" title="Your Balance" />
      </h4>
    </SectionWrapper>
  );
};

export default Reserve;
