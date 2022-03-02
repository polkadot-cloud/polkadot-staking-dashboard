import { APIContextWrapper } from './contexts/Api';
import { ConnectContextWrapper } from './contexts/Connect';
import { AssistantContextWrapper } from './contexts/Assistant';
import { ModalContextWrapper } from './contexts/Modal';
import { Entry } from './Entry';
import { DEFAULT_NETWORK } from './constants';

function App () {

  // set initial active network
  let network = localStorage.getItem('network');
  if (network === null) {
    network = DEFAULT_NETWORK;
    localStorage.setItem('network', network);
  }

  return (
    <ConnectContextWrapper>
      <APIContextWrapper>
        <AssistantContextWrapper>
          <ModalContextWrapper>
            <Entry />
          </ModalContextWrapper>
        </AssistantContextWrapper>
      </APIContextWrapper>
    </ConnectContextWrapper>
  );
}

export default App;
