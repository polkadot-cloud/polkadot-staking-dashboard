// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';
import { EXTENSIONS, ExtensionConfig } from 'config/extensions';
import { ContentWrapper, PaddingWrapper, Separator } from './Wrappers';
import { Extension } from './Extension';
import { ReadOnly } from './ReadOnly';
import { forwardRefProps } from './types';

export const Extensions = forwardRef((props: forwardRefProps, ref: any) => {
  return (
    <ContentWrapper>
      <PaddingWrapper ref={ref}>
        <div className="head">
          <h1>Extensions</h1>
        </div>
        <Separator />
        {EXTENSIONS.map((extension: ExtensionConfig, i: number) => {
          return <Extension key={`active_extension_${i}`} meta={extension} />;
        })}
        <ReadOnly {...props} />
      </PaddingWrapper>
    </ContentWrapper>
  );
});
