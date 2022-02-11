import Wrapper from './Wrapper';
import { useConnect } from '../../contexts/Connect';

export const Connect = () => {

  const connect = useConnect();

  return (
    <Wrapper onClick={() => connect.toggle()}>
      Connect Accounts
    </Wrapper>
  )
}

export default Connect;