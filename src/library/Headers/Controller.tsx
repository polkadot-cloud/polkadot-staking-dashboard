
import { useEffect } from 'react';
import { Account } from '../Account';
import { useConnect } from '../../contexts/Connect';
import { useBalances } from '../../contexts/Balances';
import { useModal } from '../../contexts/Modal';

export const Controller = () => {

  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { getBondedAccount }: any = useBalances();
  const controller = getBondedAccount(activeAccount);

  useEffect(() => {
  }, [controller, activeAccount]);

  return (
    <>
      <Account
        value={controller}
        format='name'
        label='Controller'
        canClick={true}
        onClick={() => openModalWith('ChangeController', {}, 'small')}
        filled
      />
    </>
  );
}

export default Controller;