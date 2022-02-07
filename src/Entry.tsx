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

export const Entry = () => {

  // const demo: DemoContextState = useDemo();

  return (
    <EntryWrapper>
      {/* Demo mode controller */}
      {/* <DemoBar /> */}
      <BodyInterfaceWrapper>
        <Assistant />

        {/* Left side menu */}
        <SideInterfaceWrapper>
          <SideMenu />
        </SideInterfaceWrapper>

        {/* Main Content Window */}
        <MainInterfaceWrapper>
          <AssistantButton />

        </MainInterfaceWrapper>
      </BodyInterfaceWrapper>

      {/* Network status and network details */}
      <NetworkBar />
    </EntryWrapper>
  );
}

export default Entry;