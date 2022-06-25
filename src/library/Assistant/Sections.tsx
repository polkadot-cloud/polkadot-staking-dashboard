// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft as faBack } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import { PAGES_CONFIG } from 'config/pages';
import { pageTitleFromUri } from 'Utils';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useAssistant } from 'contexts/Assistant';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { useModal } from 'contexts/Modal';
import Heading from './Heading';
import Definition from './Items/Definition';
import { CardWrapper, ListWrapper, HeaderWrapper } from './Wrappers';
import External from './Items/External';
import Action from './Items/Action';
import {
  AssistantContextInterface,
  AssistantDefinition,
  AssistantExternal,
} from '../../types/assistant';
import { SectionProps } from './types';

export const Sections = ({ pageMeta }: SectionProps) => {
  const { openModalWith } = useModal();
  const { network } = useApi() as APIContextInterface;
  const { activeAccount, accounts } = useConnect() as ConnectContextInterface;
  const { pathname } = useLocation();
  const assistant = useAssistant() as AssistantContextInterface;

  // connect handler
  const connectOnClick = () => {
    // close assistant
    assistant.toggle();
    // initialise connect
    openModalWith(
      'ConnectAccounts',
      { section: accounts.length ? 1 : 0 },
      'large'
    );
  };

  // resources to display
  const definitions = pageMeta?.definitions ?? [];
  const external = pageMeta?.external ?? [];

  // external width patterns
  let curFlexWidth = 0;
  const flexWidths = [66, 34, 100, 50, 50];

  // get definition
  const innerDefinition: AssistantDefinition = assistant.innerDefinition;

  const homeRef = useRef<any>(null);
  const itemRef = useRef<any>(null);

  useEffect(() => {
    assistant.setAssistantHeight(
      assistant.activeSection === 0
        ? homeRef.current.clientHeight
        : itemRef.current.clientHeight
    );
  }, [assistant.activeSection, assistant.open, assistant.innerDefinition]);

  return (
    <>
      <CardWrapper
        ref={homeRef}
        style={{ height: assistant.activeSection === 0 ? 'auto' : 0 }}
      >
        <HeaderWrapper>
          <div className="hold">
            <h3>{pageTitleFromUri(pathname, PAGES_CONFIG)} Resources</h3>
            <span>
              <button
                type="button"
                className="close"
                onClick={() => {
                  assistant.closeAssistant();
                }}
              >
                Close
              </button>
            </span>
          </div>
        </HeaderWrapper>
        <ListWrapper>
          {/* only display if accounts not yet connected */}
          {!activeAccount && (
            <Action
              height="120px"
              label="next step"
              title="Connect Wallet"
              subtitle={`Connect your ${network.name} accounts to start staking.`}
              onClick={connectOnClick}
            />
          )}

          {/* Display definitions */}
          {definitions.length > 0 && (
            <>
              <Heading title="Definitions" />
              {definitions.map((item: AssistantDefinition, index: number) => {
                item = assistant.fillDefinitionVariables(item);
                return (
                  <Definition
                    key={`def_${index}`}
                    onClick={() => {
                      assistant.setInnerDefinition(item);
                      assistant.setActiveSection(1);
                    }}
                    title={item.title}
                    description={item.description}
                  />
                );
              })}
            </>
          )}

          {/* Display external */}
          {external.length > 0 && (
            <>
              <Heading title="Articles" />
              {external.map((item: AssistantExternal, index: number) => {
                const thisRteturn = (
                  <External
                    key={`ext_${index}`}
                    width={flexWidths[curFlexWidth]}
                    label={item.label}
                    title={item.title}
                    subtitle={item.subtitle}
                    url={item.url}
                  />
                );

                curFlexWidth =
                  curFlexWidth > flexWidths.length - 1 ? 0 : curFlexWidth + 1;

                return thisRteturn;
              })}
            </>
          )}
        </ListWrapper>
      </CardWrapper>

      <CardWrapper
        ref={itemRef}
        style={{ height: assistant.activeSection === 1 ? 'auto' : 0 }}
      >
        <HeaderWrapper>
          <div className="hold">
            <button type="button" onClick={() => assistant.setActiveSection(0)}>
              <FontAwesomeIcon
                icon={faBack}
                transform="shrink-4"
                style={{ cursor: 'pointer', marginRight: '0.3rem' }}
              />{' '}
              Back
            </button>
            <span>
              <button
                type="button"
                className="close"
                onClick={() => {
                  assistant.closeAssistant();
                }}
              >
                Close
              </button>
            </span>
          </div>
        </HeaderWrapper>
        <ListWrapper>
          <h2>{innerDefinition?.title}</h2>
          {innerDefinition?.description.map((item, index) => (
            <p key={`inner_def_${index}`} className="definition">
              {item}
            </p>
          ))}
        </ListWrapper>
      </CardWrapper>
    </>
  );
};

export default Sections;
