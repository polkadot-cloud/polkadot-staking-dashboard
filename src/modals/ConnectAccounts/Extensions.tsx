// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';
import { useConnect } from 'contexts/Connect';
import { ConnectContextInterface } from 'types/connect';
import {
  faAngleDoubleRight,
  faGlasses,
  faCog,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ContentWrapper,
  PaddingWrapper,
  Separator,
  ExtensionWrapper,
  ReadOnlyWrapper,
} from './Wrappers';
import { Extension } from './Extension';

export const Extensions = forwardRef((props: any, ref: any) => {
  const { setSection, setReadOnlyOpen, readOnlyOpen } = props;

  const { extensions, accounts } = useConnect() as ConnectContextInterface;

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
        {extensions.map((extension: any, i: number) => {
          return (
            <Extension
              key={`active_extension_${i}`}
              meta={extension}
              setSection={setSection}
            />
          );
        })}
        <ReadOnlyWrapper>
          <ExtensionWrapper noSpacing>
            <button
              type="button"
              onClick={() => {
                setReadOnlyOpen(!readOnlyOpen);
              }}
            >
              <div>
                <FontAwesomeIcon
                  icon={faGlasses}
                  transform="grow-8"
                  style={{ margin: '0 1rem 0 1.25rem' }}
                />
                <h3>
                  <span className="name">Read Only Accounts</span>
                  <span className="message">&nbsp;</span>
                </h3>
              </div>
              <div className="neutral">
                <FontAwesomeIcon
                  icon={readOnlyOpen ? faTimes : faCog}
                  className="icon"
                  style={{ marginRight: '0.75rem' }}
                />
              </div>
            </button>
          </ExtensionWrapper>
          {readOnlyOpen && (
            <div className="content">
              <div className="account">Read Only Account</div>
            </div>
          )}
        </ReadOnlyWrapper>
      </PaddingWrapper>
    </ContentWrapper>
  );
});
