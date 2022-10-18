// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExtensionConfig, EXTENSIONS } from 'config/extensions';
import { useConnect } from 'contexts/Connect';
import { forwardRef } from 'react';
import { Extension } from './Extension';
import { ReadOnly } from './ReadOnly';
import { forwardRefProps } from './types';
import {
  ContentWrapper,
  ExtensionWrapper,
  PaddingWrapper,
  Separator,
} from './Wrappers';

export const Extensions = forwardRef((props: forwardRefProps, ref: any) => {
  const { setSection } = props;

  const { accounts } = useConnect();

  return (
    <ContentWrapper>
      <PaddingWrapper ref={ref}>
        <div className="head">
          <h1>Extensions</h1>
        </div>
        <ExtensionWrapper>
          <button
            type="button"
            onClick={() => {
              setSection(1);
            }}
          >
            <div>
              <h3>
                <span className="name">
                  {accounts.length} Imported Account
                  {accounts.length !== 1 && 's'}
                </span>
              </h3>
            </div>
            <div className="neutral">
              <FontAwesomeIcon icon={faAngleDoubleRight} className="icon" />
            </div>
          </button>
        </ExtensionWrapper>
        <Separator />
        {EXTENSIONS.map((extension: ExtensionConfig, i: number) => {
          return (
            <Extension
              key={`active_extension_${i}`}
              meta={extension}
              setSection={setSection}
            />
          );
        })}
        <ReadOnly {...props} />
      </PaddingWrapper>
    </ContentWrapper>
  );
});
