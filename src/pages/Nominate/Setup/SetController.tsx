// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { SetupType } from 'contexts/UI/types';
import { AccountSelect } from 'library/Form/AccountSelect';
import { InputItem } from 'library/Form/types';
import { Warning } from 'library/Form/Warning';
import { useEligibleControllers } from 'library/Hooks/useEligibleControllers';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { SetupStepProps } from 'library/SetupSteps/types';
import { useEffect, useState } from 'react';
import { planckBnToUnit } from 'Utils';
import { Spacer } from '../Wrappers';

export const SetController = (props: SetupStepProps) => {
  const { section } = props;

  const { consts, network } = useApi();
  const { activeAccount, accounts, getAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const setup = getSetupProgress(SetupType.Stake, activeAccount);
  const { existentialDeposit } = consts;
  const existentialDepositBase = planckBnToUnit(
    existentialDeposit,
    network.units
  );

  // store the currently selected controller account
  const _selected = setup.controller !== null ? setup.controller : null;
  const [selected, setSelected] = useState<InputItem | null>(
    getAccount(_selected)
  );

  // get eligible controllers for input
  const items = useEligibleControllers();

  // check if at least one item has enough unit to become a controller
  const itemsWithEnoughBalance = items
    .map(
      (i: InputItem) =>
        i?.balance?.freeAfterReserve.gt(existentialDeposit) ?? false
    )
    .filter((i: boolean) => i).length;

  // update selected value on account switch
  useEffect(() => {
    const _initial = getAccount(
      setup.controller !== null ? setup.controller : null
    );
    setSelected(_initial);
  }, [activeAccount, accounts, getAccount, setup.controller]);

  const handleOnChange = ({ selectedItem }: { selectedItem: InputItem }) => {
    setSelected(selectedItem);
    setActiveAccountSetup(SetupType.Stake, {
      ...setup,
      controller: selectedItem?.address ?? null,
    });
  };

  return (
    <>
      <Header
        thisSection={section}
        title="Set Controller Account"
        helpKey="Stash and Controller Accounts"
        complete={setup.controller !== null}
        setupType={SetupType.Stake}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {items.length === 0 && (
          <Warning
            text={`None of your imported accounts have the minimum deposit of ${existentialDepositBase} ${network.unit}. Top up an account to make it eligible to become a controller.`}
          />
        )}
        {itemsWithEnoughBalance === 0 && (
          <Warning
            text={`You have no other accounts imported. To select a controller, import another account with a balance of at least ${existentialDepositBase} ${network.unit}.`}
          />
        )}
        <Spacer />
        <AccountSelect
          items={items}
          onChange={handleOnChange}
          placeholder="Search Account"
          value={selected}
        />
        <Footer
          complete={setup.controller !== null}
          setupType={SetupType.Stake}
        />
      </MotionContainer>
    </>
  );
};

export default SetController;
