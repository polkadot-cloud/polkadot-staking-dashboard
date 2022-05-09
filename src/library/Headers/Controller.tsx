
import { Account } from '../Account';
import { useConnect } from '../../contexts/Connect';
import { useStaking } from '../../contexts/Staking';
import { useBalances } from '../../contexts/Balances';
import { useModal } from '../../contexts/Modal';

export const Controller = () => {

  const { openModalWith } = useModal();
  const { hasController } = useStaking();
  const { activeAccount } = useConnect();
  const { getBondedAccount }: any = useBalances();
  const controller = getBondedAccount(activeAccount);

  return (
    <>
      <Account
        value={controller}
        format='name'
        label='Controller'
        canClick={hasController()}
        onClick={() => { hasController() && openModalWith('UpdateController', {}, 'small') }}
        filled
      />
    </>
  );
}

export default Controller;