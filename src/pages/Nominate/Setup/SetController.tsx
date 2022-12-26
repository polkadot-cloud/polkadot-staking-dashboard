// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { AccountSelect } from 'library/Form/AccountSelect';
import { InputItem } from 'library/Form/types';
import { getEligibleControllers } from 'library/Form/Utils/getEligibleControllers';
import { Warning } from 'library/Form/Warning';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { SetupStepProps } from 'library/SetupSteps/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit } from 'Utils';
import { Spacer } from '../Wrappers';

export const SetController = (props: SetupStepProps) => {
  const { section } = props;
  const { t } = useTranslation('pages');

  const { consts, network } = useApi();
  const { activeAccount, accounts, getAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const setup = getSetupProgress('stake', activeAccount);
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
  const items = getEligibleControllers();

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
  }, [activeAccount, accounts]);

  const handleOnChange = ({ selectedItem }: { selectedItem: InputItem }) => {
    setSelected(selectedItem);
    setActiveAccountSetup('stake', {
      ...setup,
      controller: selectedItem?.address ?? null,
    });
  };

  return (
    <>
      <Header
        thisSection={section}
        title={t('nominate.setControllerAccount') || ''}
        helpKey="Stash and Controller Accounts"
        complete={setup.controller !== null}
        setupType="stake"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        {items.length === 0 && (
          <Warning
            text={`${t('nominate.noneOfYour')} ${existentialDepositBase} ${
              network.unit
            }. ${t('nominate.topUpAccount')}`}
          />
        )}
        {itemsWithEnoughBalance === 0 && (
          <Warning
            text={`${t(
              'nominate.selectAController'
            )} ${existentialDepositBase} ${network.unit}.`}
          />
        )}
        <Spacer />
        <AccountSelect
          items={items}
          onChange={handleOnChange}
          placeholder={t('nominate.searchAccount')}
          value={selected}
        />
        <Footer complete={setup.controller !== null} setupType="stake" />
      </MotionContainer>
    </>
  );
};

export default SetController;
