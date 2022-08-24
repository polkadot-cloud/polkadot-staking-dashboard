// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { AccountSelect } from 'library/Form/AccountSelect';
import { getEligibleControllers } from 'library/Form/Utils/getEligibleControllers';
import { InputItem } from 'library/Form/types';
import { SetupType } from 'contexts/UI/types';
import { Header } from 'library/SetupSteps/Header';
import { Footer } from 'library/SetupSteps/Footer';
import { Spacer } from '../Wrappers';
import { MotionContainer } from './MotionContainer';
import { SetControllerProps } from '../types';

export const SetController = (props: SetControllerProps) => {
  const { section } = props;

  const { activeAccount, accounts, getAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const setup = getSetupProgress(SetupType.Stake, activeAccount);

  // store the currently selected controller account
  const _selected = setup.controller !== null ? setup.controller : null;
  const [selected, setSelected] = useState<InputItem | null>(
    getAccount(_selected)
  );

  // get eligible controllers for input
  const items = getEligibleControllers();

  // update selected value on account switch
  useEffect(() => {
    const _initial = getAccount(
      setup.controller !== null ? setup.controller : null
    );
    setSelected(_initial);
  }, [activeAccount, accounts]);

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
        assistantPage="stake"
        assistantKey="Stash and Controller Accounts"
        complete={setup.controller !== null}
        setupType={SetupType.Stake}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
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
