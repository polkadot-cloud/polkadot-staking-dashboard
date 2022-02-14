import Wrapper from './Wrapper';
import { useDemo } from '../../contexts/Demo';

export const DemoBar = () => {

  const { mode } = useDemo();

  if (mode === 0) {
    return (<></>);
  }

  return (
    <Wrapper>
      <section>
        Polkadot Staking Experience Demo
      </section>
      <section>
        <div>
          <button onClick={() => { }}>Network Only</button>
        </div>
      </section>
    </Wrapper>
  )
}

export default DemoBar;