// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronCircleRight,
  faRedoAlt,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { BN } from 'bn.js';
import { PayeeStatus } from 'consts';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators';
import { planckBnToUnit, rmCommas, registerSaEvent } from 'Utils';
import { CardWrapper } from 'library/Graphs/Wrappers';
import Stat from 'library/Stat';
import { Separator } from 'Wrappers';
import { Controller } from './Controller';

export const Status = ({ height }: { height: number }) => {
  const { isReady, network } = useApi();
  const { setOnNominatorSetup, getStakeSetupProgressPercent }: any = useUi();
  const { openModalWith } = useModal();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { isSyncing } = useUi();
  const { getNominationsStatus, staking, inSetup, eraStakers } = useStaking();
  const { getAccountNominations } = useBalances();
  const { stakers } = eraStakers;
  const { payee } = staking;
  const { meta, validators } = useValidators();
  const nominations = getAccountNominations(activeAccount);

  // get nomination status
  const nominationStatuses = getNominationsStatus();

  // get active nominations
  const activeNominees = Object.entries(nominationStatuses)
    .map(([k, v]: any) => (v === 'active' ? k : false))
    .filter((v) => v !== false);

  // check if rewards are being earned
  const stake = meta.validators_browse?.stake ?? [];
  const stakeSynced = stake.length > 0 ?? false;

  let earningRewards = false;
  if (stakeSynced) {
    for (const nominee of activeNominees) {
      const validator = validators.find((v: any) => v.address === nominee);
      if (validator) {
        const batchIndex = validators.indexOf(validator);
        const nomineeMeta = stake[batchIndex];
        const { lowestReward } = nomineeMeta;

        const validatorInEra =
          stakers.find((s: any) => s.address === nominee) || null;

        if (validatorInEra) {
          const { others } = validatorInEra;
          const stakedValue =
            others?.find((o: any) => o.who === activeAccount)?.value ?? false;
          if (stakedValue) {
            const stakedValueBase = planckBnToUnit(
              new BN(rmCommas(stakedValue)),
              network.units
            );
            if (stakedValueBase >= lowestReward) {
              earningRewards = true;
              break;
            }
          }
        }
      }
    }
  }

  const payeeStatus = PayeeStatus.find((item) => item.key === payee);

  let startTitle = 'Start Nominating';
  if (inSetup()) {
    const progress = getStakeSetupProgressPercent(activeAccount);
    if (progress > 0) {
      startTitle += `: ${progress}%`;
    }
  }
  return (
    <CardWrapper height={height}>
      <Stat
        label="Status"
        helpKey="Nomination Status"
        stat={
          inSetup() || isSyncing
            ? 'Not Nominating'
            : !nominations.length
            ? 'Inactive: No Nominations Set'
            : activeNominees.length
            ? `Nominating and ${
                earningRewards ? 'Earning Rewards' : 'Not Earning Rewards'
              }`
            : 'Waiting for Active Nominations'
        }
        buttons={
          !inSetup()
            ? []
            : [
                {
                  title: startTitle,
                  icon: faChevronCircleRight,
                  transform: 'grow-1',
                  disabled:
                    !isReady ||
                    isReadOnlyAccount(activeAccount) ||
                    !activeAccount,
                  onClick: () => {
                    registerSaEvent(
                      `${network.name.toLowerCase()}_nominate_setup_button_pressed`
                    );
                    setOnNominatorSetup(1);
                  },
                },
              ]
        }
      />
      <Separator />
      <Stat
        label="Reward Destination"
        helpKey="Reward Destination"
        icon={
          (payee === null
            ? faCircle
            : payee === 'Staked'
            ? faRedoAlt
            : payee === 'None'
            ? faCircle
            : faWallet) as IconProp
        }
        stat={inSetup() ? 'Not Assigned' : payeeStatus?.name ?? 'Not Assigned'}
        buttons={
          !inSetup()
            ? [
                {
                  title: 'Update',
                  icon: faWallet,
                  small: true,
                  disabled:
                    inSetup() || isSyncing || isReadOnlyAccount(activeAccount),
                  onClick: () => openModalWith('UpdatePayee', {}, 'small'),
                },
              ]
            : []
        }
      />
      <Separator />
      <Controller label="Controller Account" />
    </CardWrapper>
  );
};

export default Status;
