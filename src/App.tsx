import { APIContextWrapper } from './contexts/Api';
import { ConnectContextWrapper } from './contexts/Connect';
import { DemoContextWrapper } from './contexts/Demo';
import { AssistantContextWrapper } from './contexts/Assistant';
import { ModalContextWrapper } from './contexts/Modal';
import { Entry } from './Entry';

function App () {

  return (
    <DemoContextWrapper>
      <ConnectContextWrapper>
        <APIContextWrapper>
          <AssistantContextWrapper>
            <ModalContextWrapper>
              <Entry />
            </ModalContextWrapper>
          </AssistantContextWrapper>
        </APIContextWrapper>
      </ConnectContextWrapper>
    </DemoContextWrapper>
  );
}

export default App;
