import { useEffect } from 'react';
// import { useDemo, DemoContextState } from './contexts/Demo';
// import { DemoBar } from './library/DemoBar';
import { NetworkBar } from './library/NetworkBar';
import {
  EntryWrapper,
  SideInterfaceWrapper,
  MainInterfaceWrapper,
  BodyInterfaceWrapper,
} from './Wrappers';
import AssistantButton from './library/AssistantButton';
import SideMenu from './library/SideMenu';
import Assistant from './library/Assistant';
import { useApi } from './contexts/Api';
import { BrowserRouter } from "react-router-dom";
import Router from './Router';

export const Entry = () => {

  const { connect }: any = useApi();

  // initial connection to Polakdot API
  useEffect(() => {
    connect();
  }, []);

  // const demo: DemoContextState = useDemo();

  return (
    <EntryWrapper>
      {/* Demo mode controller */}
      {/* <DemoBar /> */}
      <BodyInterfaceWrapper>
        <Assistant />

        <BrowserRouter>
          {/* Left side menu */}
          <SideInterfaceWrapper>
            <SideMenu />
          </SideInterfaceWrapper>

          {/* Main Content Window */}
          <MainInterfaceWrapper>
            <AssistantButton />
            <Router />
          </MainInterfaceWrapper>
        </BrowserRouter>
      </BodyInterfaceWrapper>

      {/* Network status and network details */}
      <NetworkBar />
    </EntryWrapper>
  );
}

export default Entry;