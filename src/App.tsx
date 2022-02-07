import { APIContextWrapper } from './contexts/Api';
import { DemoContextWrapper } from './contexts/Demo';
import { AssistantContextWrapper } from './contexts/Assistant';
import { Entry } from './Entry';

function App () {
  return (
    <DemoContextWrapper>
      <APIContextWrapper>
        <AssistantContextWrapper>
          <Entry />
        </AssistantContextWrapper>
      </APIContextWrapper>
    </DemoContextWrapper>
  );
}

export default App;
