// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';

export const APY = (props: any) => {
  const { height } = props;

  return (
    <CardWrapper height={height} flex>
      <CardHeaderWrapper>
        <h4>
          Estimated APY
          <OpenAssistantIcon page="overview" title="Your Balance" />
        </h4>
      </CardHeaderWrapper>
    </CardWrapper>
  );
};

export default APY;
