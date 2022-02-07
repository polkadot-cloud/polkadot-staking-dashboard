import { DemoContextWrapper } from './contexts/Demo';
import { AssistantContextWrapper } from './contexts/Assistant';
import { Entry } from './Entry';

function App () {
  return (
    <DemoContextWrapper>
      <AssistantContextWrapper>
        <Entry />
      </AssistantContextWrapper>
    </DemoContextWrapper>
  );
}

export default App;
