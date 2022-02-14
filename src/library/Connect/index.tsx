import Wrapper from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';

export const Connect = () => {

  const connect = useConnect();
  const { toggle } = useModal();

  return (
    <Wrapper onClick={() => toggle()}>
      Connect Accounts
    </Wrapper>
  )
}

export default Connect;