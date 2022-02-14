import React from 'react';
import { DemoBar } from './library/DemoBar';
import { NetworkBar } from './library/NetworkBar';
import {
  EntryWrapper,
  SideInterfaceWrapper,
  MainInterfaceWrapper,
  BodyInterfaceWrapper,
} from './Wrappers';
import { Modal } from './library/Modal';
import AssistantButton from './library/AssistantButton';
import SideMenu from './library/SideMenu';
import Assistant from './library/Assistant';
import { APIContext } from './contexts/Api';
import { BrowserRouter } from "react-router-dom";
import Router from './Router';

export class Entry extends React.Component {

  static contextType?: React.Context<any> = APIContext;

  componentDidMount () {
    // initial connection to Polakdot API
    this.context.connect();
  }

  render () {
    return (
      <EntryWrapper>
        <BrowserRouter>
          {/* modal */}
          <Modal />
          {/* Demo mode controller */}
          <DemoBar />
          <BodyInterfaceWrapper>

            <Assistant />
            {/* Left side menu */}
            <SideInterfaceWrapper>
              <SideMenu />
            </SideInterfaceWrapper>

            {/* Main Content Window */}
            <MainInterfaceWrapper>
              <AssistantButton />
              <Router />
            </MainInterfaceWrapper>
          </BodyInterfaceWrapper>

          {/* Network status and network details */}
          <NetworkBar />
        </BrowserRouter>
      </EntryWrapper>
    );
  }
}

export default Entry;