// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { APIContextWrapper } from './contexts/Api';
import { ConnectContextWrapper } from './contexts/Connect';
import { AssistantContextWrapper } from './contexts/Assistant';
import { ModalContextWrapper } from './contexts/Modal';
import { Entry } from './Entry';
import { DEFAULT_NETWORK } from './constants';
import { ThemeContextWrapper, useTheme } from './contexts/Themes';
import { ThemeProvider } from 'styled-components';

export class App extends React.Component<any> {

  render () {
    return (
      <ThemeContextWrapper>
        <AppInner />
      </ThemeContextWrapper>
    )
  }
}

const AppInner = () => {

  // get theme
  const { mode } = useTheme();

  // set initial active network
  let network = localStorage.getItem('network');
  if (network === null) {
    network = DEFAULT_NETWORK;
    localStorage.setItem('network', network);
  }

  return (
    <ThemeProvider
      theme={{
        mode: mode
      }}
    >
      <ConnectContextWrapper>
        <APIContextWrapper>
          <AssistantContextWrapper>
            <ModalContextWrapper>
              <Entry />
            </ModalContextWrapper>
          </AssistantContextWrapper>
        </APIContextWrapper>
      </ConnectContextWrapper>
    </ThemeProvider>
  );
}

export default App;
