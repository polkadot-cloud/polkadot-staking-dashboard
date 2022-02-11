import { APIContextWrapper } from './contexts/Api';
import { ConnectContextWrapper } from './contexts/Connect';
import { DemoContextWrapper } from './contexts/Demo';
import { AssistantContextWrapper } from './contexts/Assistant';
import { Entry } from './Entry';

function App () {
  return (
    <DemoContextWrapper>
      <ConnectContextWrapper>
        <APIContextWrapper>
          <AssistantContextWrapper>
            <Entry />
          </AssistantContextWrapper>
        </APIContextWrapper>
      </ConnectContextWrapper>
    </DemoContextWrapper>
  );
}

export default App;
