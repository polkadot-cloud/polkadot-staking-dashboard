import Wrapper from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';

export const ConnectAccounts = () => {

  const { connect } = useConnect();
  const modal = useModal();

  return (
    <Wrapper>
      <h2>Connect Accounts</h2>
      <button onClick={() => { connect(); modal.setStatus(2); }}>
        Polkadot JS
      </button>
    </Wrapper>
  )
}

export default ConnectAccounts;