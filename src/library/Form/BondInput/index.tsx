// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { Wrapper } from './Wrapper';
import { useApi } from '../../../contexts/Api';
import { useConnect } from '../../../contexts/Connect';
import { useBalances } from '../../../contexts/Balances';
import { isNumeric, planckToDot } from '../../../Utils';

export const BondInput = (props: any) => {

  // functional props
  const setters = props.setters ?? [];

  // input props
  const { disabled } = props;

  // whether to bond or unbond
  const task = props.task ?? 'bond';

  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { getAccountBalance, getBondedAccount, getAccountLedger, minReserve }: any = useBalances();
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);

  const { active } = ledger;
  const balance = getAccountBalance(activeAccount);
  let { free } = balance;

  let freeToBond: any = free - minReserve - active;
  freeToBond = freeToBond < 0 ? 0 : freeToBond;

  // default value will either be available to bond, or total bonded
  let _bond = task === 'bond' ? freeToBond : active;
  const [bond, setBond] = useState(planckToDot(_bond));

  // handle change for bonding
  const handleChangeBond = (e: any) => {
    let { value } = e.target;
    if (!isNumeric(value) && value !== '') {
      return;
    }
    setBond(value);

    // set parent setters with bond value if supplied
    if (value < freeToBond && value !== '') {
      for (let s of setters) {
        s.set({
          ...s.current,
          bond: value
        });
      }
    }
  }

  // handle change for unbonding
  const handleChangeUnbond = (e: any) => {
    let { value } = e.target;
    if (!isNumeric(value) && value !== '') {
      return;
    }
    setBond(value);

    // set parent setters with bond value if supplied
    if (value <= active && value !== '') {
      for (let s of setters) {
        s.set({
          ...s.current,
          bond: value
        });
      }
    }
  }

  return (
    <Wrapper>
      <section style={{ opacity: disabled ? 0.5 : 1 }}>
        <h3>{task === 'unbond' ? 'Unbond' : 'Bond'} {network.unit}:</h3>
        <input
          type="text"
          placeholder={`0 ${network.unit}`}
          value={bond}
          onChange={(e) => {
            if (task === 'bond') {
              handleChangeBond(e);
            } else {
              handleChangeUnbond(e);
            }
          }}
          disabled={disabled}
        />
      </section>
      <section>

      </section>
    </Wrapper>
  )
}

export default BondInput;