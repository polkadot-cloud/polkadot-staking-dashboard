// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';
import { useConnect } from 'contexts/Connect';
import { ConnectContextInterface } from 'types/connect';
import { ContentWrapper, PaddingWrapper } from './Wrappers';
import { Extension } from './Extension';

export const Extensions = forwardRef((props: any, ref: any) => {
  const { setSection } = props;

  const { extensions } = useConnect() as ConnectContextInterface;

  return (
    <ContentWrapper>
      <PaddingWrapper ref={ref}>
        <div className="head">
          <h1>Extensions</h1>
        </div>

        {extensions.map((extension: any, i: number) => {
          return (
            <Extension
              key={`active_extension_${i}`}
              meta={extension}
              setSection={setSection}
            />
          );
        })}
      </PaddingWrapper>
    </ContentWrapper>
  );
});
