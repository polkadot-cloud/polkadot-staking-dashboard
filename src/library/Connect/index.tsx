import Wrapper from './Wrapper';
import { useModal } from '../../contexts/Modal';

export const Connect = () => {

  const { setStatus } = useModal();

  return (
    <Wrapper onClick={() => setStatus(1)}>
      Connect Accounts
    </Wrapper>
  )
}

export default Connect;