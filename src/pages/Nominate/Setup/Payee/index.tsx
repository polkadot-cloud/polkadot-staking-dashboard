// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faArrowDown,
  faArrowRightFromBracket,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { PayeeConfig, PayeeOptions } from 'contexts/Setup/types';
import { Spacer } from 'library/Form/Wrappers';
import { SelectItems } from 'library/SelectItems';
import { SelectItem } from 'library/SelectItems/Item';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { SetupStepProps } from 'library/SetupSteps/types';
import { useEffect, useState } from 'react';
import { MaybeAccount } from 'types';
import { AccountInput } from './AccountInput';
import { PayeeItem } from './types';

export const Payee = ({ section }: SetupStepProps) => {
  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();

  const setup = getSetupProgress('stake', activeAccount);
  const { progress } = setup;
  const { payee } = progress;

  // Store the current user-inputted custom payout account.
  const [account, setAccount] = useState<MaybeAccount>(payee.account);

  const DefaultPayeeConfig: PayeeConfig = {
    destination: 'Staked',
    account: null,
  };

  const items: Array<PayeeItem> = [
    {
      value: 'Staked',
      title: 'Compound',
      subtitle: 'Add payouts to your existing staked balance automatically.',
      icon: faRotate,
    },
    {
      value: 'Stash',
      title: 'To Staking Account',
      subtitle: 'Payouts are sent to your account as free balance.',
      icon: faArrowDown,
    },
    {
      value: 'Account',
      title: 'To Another Account',
      subtitle: 'Send payouts to another account as free balance.',
      icon: faArrowRightFromBracket,
    },
  ];

  // determine whether this section is completed.
  const isComplete = () =>
    payee.destination !== null &&
    !(payee.destination === 'Account' && payee.account === null);

  // update setup progress with payee config.
  const handleChangeDestination = (destination: PayeeOptions) => {
    // set local value to update input element set setup payee
    setActiveAccountSetup('stake', {
      ...progress,
      payee: { destination, account },
    });
  };

  // update setup progress with payee account.
  const handleChangeAccount = (newAccount: MaybeAccount) => {
    // set local value to update input element set setup payee
    setActiveAccountSetup('stake', {
      ...progress,
      payee: { ...payee, account: newAccount },
    });
  };

  // set initial payee value to `Staked` if not yet set.
  useEffect(() => {
    if (!payee || (!payee.destination && !payee.account)) {
      setActiveAccountSetup('stake', {
        ...progress,
        payee: DefaultPayeeConfig,
      });
    }
  }, [activeAccount]);

  return (
    <>
      <Header
        thisSection={section}
        complete={isComplete()}
        title="Payout Destination"
        helpKey="Reward Destination"
        setupType="stake"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <h4 style={{ marginTop: '0.5rem' }}>
          Choose how payouts will be received. Payouts can either be compounded
          or sent to an account as free balance.
        </h4>

        <SelectItems>
          {items.map((item: PayeeItem) => (
            <SelectItem
              key={`payee_option_${item.value}`}
              account={account}
              setAccount={setAccount}
              selected={payee.destination === item.value}
              onClick={() => handleChangeDestination(item.value)}
              {...item}
            />
          ))}
        </SelectItems>
        <Spacer />
        <AccountInput
          account={account}
          setAccount={setAccount}
          handleChange={handleChangeAccount}
        />
        <Footer complete={isComplete()} setupType="stake" />
      </MotionContainer>
    </>
  );
};
