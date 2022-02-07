import Wrapper from './Wrapper';
import { useAssistant } from '../../contexts/Assistant';

export const AssistantButton = () => {

  const assistant = useAssistant();

  return (
    <Wrapper>
      <div>
        <section>
          <p className='label'>[subject]</p>
        </section>
        <section>
          <button onClick={() => { assistant.toggle() }}>
            <div>[icon]</div>
            Assistant
          </button>
        </section>
      </div>
    </Wrapper>
  );
}

export default AssistantButton;