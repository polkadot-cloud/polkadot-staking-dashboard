// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { Separator, SectionWrapper } from './Wrappers';

export const Reserve = (props: any) => {
  const { height } = props;

  return (
    <SectionWrapper style={{ height }}>
      <Separator />
      <CardHeaderWrapper>
        <h4>
          Reserve Balance
          <OpenAssistantIcon page="overview" title="Your Balance" />
        </h4>
      </CardHeaderWrapper>
    </SectionWrapper>
  );
};

export default Reserve;
