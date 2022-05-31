// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faRedoAlt,
  faWallet,
  faChevronCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Separator } from 'Wrappers';
import { SectionWrapper } from 'library/Graphs/Wrappers';
import { useStaking } from 'contexts/Staking';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { PAYEE_STATUS } from 'consts';
import { useUi } from 'contexts/UI';
import { useApi } from 'contexts/Api';
import Stat from 'library/Stat';
import { APIContextInterface } from 'types/api';

export const Status = () => {
  const { isReady } = useApi() as APIContextInterface;
  const { setOnSetup, getSetupProgressPercent }: any = useUi();
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { isSyncing } = useUi();
  const { getNominationsStatus, staking, inSetup } = useStaking();
  const { getAccountNominations }: any = useBalances();
  const { payee } = staking;
  const nominations = getAccountNominations(activeAccount);

  // get nomination status
  const nominationStatuses = getNominationsStatus();

  const active: any = Object.values(nominationStatuses).filter(
    (_v: any) => _v === 'active'
  ).length;

  const payeeStatus: any = PAYEE_STATUS.find((item: any) => item.key === payee);

  let startTitle = 'Start Staking';
  if (inSetup()) {
    const progress = getSetupProgressPercent(activeAccount);
    if (progress > 0) {
      startTitle += `: ${progress}%`;
    }
  }
  return (
    <SectionWrapper height={300}>
      <Stat
        label="Status"
        assistant={['stake', 'Staking Status']}
        stat={
          inSetup() || isSyncing
            ? 'Not Staking'
            : !nominations.length
            ? 'Inactive: Not Nominating'
            : active
            ? 'Actively Nominating with Bonded Funds'
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
                  disabled: !isReady,
                  onClick: () => setOnSetup(true),
                },
              ]
        }
      />
      <Separator />
      <Stat
        label="Reward Destination"
        assistant={['stake', 'Reward Destination']}
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
        buttons={[
          {
            title: 'Update',
            small: true,
            disabled: inSetup() || isSyncing,
            onClick: () => openModalWith('UpdatePayee', {}, 'small'),
          },
        ]}
      />
    </SectionWrapper>
  );
};

export default Status;
