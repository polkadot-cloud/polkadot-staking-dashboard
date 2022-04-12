
import { useEffect } from 'react';
import { Account } from '../Account';
import { useConnect } from '../../contexts/Connect';
import { useBalances } from '../../contexts/Balances';

export const Controller = () => {

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
        canClick={false}
        unassigned={controller === null}
        style={{ cursor: 'default' }}
        filled
      />
    </>
  );
}

export default Controller;