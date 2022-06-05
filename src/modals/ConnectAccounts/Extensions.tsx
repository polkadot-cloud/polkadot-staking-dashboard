// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, forwardRef } from 'react';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { ConnectContextInterface } from 'types/connect';
import { ContentWrapper, PaddingWrapper } from './Wrappers';
import { Extension } from './Extension';

export const Extensions = forwardRef((props: any, ref: any) => {
  const { setSection } = props;

  const modal = useModal();
  const { extensions } = useConnect() as ConnectContextInterface;

  // trigger modal resize on extensions change
  useEffect(() => {
    modal.setResize();
  }, [extensions]);

  return (
    <ContentWrapper>
      <PaddingWrapper ref={ref}>
        <h2>Select Wallet</h2>

        {extensions.map((extension: any, i: number) => {
          return (
            <Extension
              key={`active_extension_${i}`}
              meta={extension}
              disabled={false}
              setSection={setSection}
            />
          );
        })}
      </PaddingWrapper>
    </ContentWrapper>
  );
});
