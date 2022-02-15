import Wrapper from './Wrapper';
import { useDemo } from '../../contexts/Demo';
import window from 'window-or-global';
import { useConnect } from '../../contexts/Connect';
import { useNavigate } from 'react-router-dom';
import { useAssistant } from '../../contexts/Assistant';

export const DemoBar = () => {

  const demo = useDemo();
  const connect = useConnect();
  const navigate = useNavigate();
  const assistant = useAssistant();

  if (demo.mode === 0) {
    return (<></>);
  }

  // resets the app from all user activity
  const reset = () => {
    // clear local storage
    window.localStorage.clear();
    // clear accounts connected
    connect.disconnect();
    //close assistant
    if (assistant.open) {
      assistant.toggle();
    }
    // refresh window + back to overview
    navigate('/');
    // close demo bar
    demo.switch(0);
  }

  return (
    <Wrapper>
      <section>
        Polkadot Staking Experience Demo
      </section>
      <section>
        <div>
          <button onClick={() => reset()}>Reset App</button>
        </div>
      </section>
    </Wrapper >
  )
}

export default DemoBar;