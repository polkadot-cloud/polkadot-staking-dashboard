// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { AccountSelect } from 'library/Form/AccountSelect';
import { planckToUnit } from 'Utils';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { BalancesContextInterface } from 'types/balances';
import { Header } from './Header';
import { Footer } from './Footer';
import { Spacer } from '../Wrappers';
import { MotionContainer } from './MotionContainer';

export const SetController = (props: any) => {
  const { section } = props;

  const { network } = useApi() as APIContextInterface;
  const { units } = network;
  const { activeAccount, accounts, getAccount } =
    useConnect() as ConnectContextInterface;
  const { getAccountBalance, minReserve, isController } =
    useBalances() as BalancesContextInterface;
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const setup = getSetupProgress(activeAccount);

  // store the currently selected controller account
  const _selected = setup.controller !== null ? setup.controller : null;
  const [selected, setSelected] = useState<any>(getAccount(_selected));

  // update selected value on account switch
  useEffect(() => {
    const _initial = getAccount(
      setup.controller !== null ? setup.controller : null
    );
    setSelected(_initial);
  }, [activeAccount, accounts]);

  const handleOnChange = ({ selectedItem }: any) => {
    setSelected(selectedItem);
    setActiveAccountSetup({
      ...setup,
      controller: selectedItem?.address ?? null,
    });
  };

  // filter items that are already controller accounts
  let items = accounts.filter((acc: any) => {
    return !isController(acc.address);
  });

  // inject balances and whether account can be an active item
  items = items.filter((acc: any) => acc.address !== activeAccount);
  items = items.map((acc: any) => {
    const balance = getAccountBalance(acc.address);

    return {
      ...acc,
      balance,
      active:
        planckToUnit(balance.free.toNumber(), units) >=
        planckToUnit(minReserve.toNumber(), units),
      alert: `Not Enough ${network.unit}`,
    };
  });

  // sort accounts with at least free balance first
  items = items.sort((a: any, b: any) => {
    return b.balance.free.sub(a.balance.free).toNumber();
  });

  return (
    <>
      <Header
        thisSection={section}
        title="Set Controller Account"
        assistantPage="stake"
        assistantKey="Stash and Controller Accounts"
        complete={setup.controller !== null}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <Spacer />
        <AccountSelect
          items={items}
          onChange={handleOnChange}
          placeholder="Search Account"
          value={selected}
        />
        <Footer complete={setup.controller !== null} />
      </MotionContainer>
    </>
  );
};

export default SetController;
