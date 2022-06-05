// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { AccountSelect } from 'library/Form/AccountSelect';
import { planckToUnit } from 'Utils';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
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
  const { getBondedAccount, getAccountBalance, minReserve, isController }: any =
    useBalances();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const controller = getBondedAccount(activeAccount);
  const setup = getSetupProgress(activeAccount);
  const initialValue =
    setup.controller !== null ? setup.controller : controller;
  const initialAccount = getAccount(initialValue);

  // store the currently selected controller account
  const [selected, setSelected] = useState(initialAccount);

  // update selected value on account switch
  useEffect(() => {
    const _selected = setup.controller !== null ? setup.controller : controller;
    const _initial = getAccount(_selected);
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
    <CardWrapper transparent>
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
    </CardWrapper>
  );
};

export default SetController;
