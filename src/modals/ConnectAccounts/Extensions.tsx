// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';
import { useConnect } from 'contexts/Connect';
import { ConnectContextInterface } from 'types/connect';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ContentWrapper,
  PaddingWrapper,
  Separator,
  ExtensionWrapper,
} from './Wrappers';
import { Extension } from './Extension';

export const Extensions = forwardRef((props: any, ref: any) => {
  const { setSection } = props;

  const { extensions, accounts } = useConnect() as ConnectContextInterface;

  return (
    <ContentWrapper>
      <PaddingWrapper ref={ref}>
        <div className="head">
          <h1>Extensions</h1>
        </div>
        {/* <Extension meta={extension} setSection={setSection} /> */}
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
              <FontAwesomeIcon
                icon={faAngleDoubleRight}
                transform="shrink-0"
                className="icon"
              />
            </div>
          </button>
        </ExtensionWrapper>
        <Separator />
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
