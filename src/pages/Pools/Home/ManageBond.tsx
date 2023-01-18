// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import BondedGraph from 'library/Graphs/Bonded';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { planckToUnit } from 'Utils';
import { ButtonRowWrapper } from 'Wrappers';

export const ManageBond = () => {
  const { network } = useApi();
  const { units } = network;
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { poolsSyncing } = useUi();
  const { isBonding, isMember, selectedActivePool } = useActivePools();
  const { getTransferOptions } = useTransferOptions();
  const { t } = useTranslation('pages');

  const allTransferOptions = getTransferOptions(activeAccount);
  const { freeBalance } = allTransferOptions;
  const { active, totalUnlocking, totalUnlocked, totalUnlockChuncks } =
    allTransferOptions.pool;

  const { state } = selectedActivePool?.bondedPool || {};

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          {t('pools.bondedFunds')}
          <OpenHelpIcon helpKey="Bonded in Pool" />
        </h4>
        <h2>{`${planckToUnit(active, units).toFormat()} ${network.unit}`}</h2>
        <ButtonRowWrapper>
          <ButtonPrimary
            disabled={
              poolsSyncing ||
              !isBonding() ||
              !isMember() ||
              state === 'Destroying'
            }
            marginRight
            onClick={() => openModalWith('Bond', { bondFor: 'pool' }, 'small')}
            text="+"
          />
          <ButtonPrimary
            disabled={
              poolsSyncing ||
              !isBonding() ||
              !isMember() ||
              state === 'Destroying'
            }
            marginRight
            onClick={() =>
              openModalWith('Unbond', { bondFor: 'pool' }, 'small')
            }
            text="-"
          />
          <ButtonPrimary
            disabled={poolsSyncing || !isMember() || state === 'Destroying'}
            iconLeft={faLockOpen}
            onClick={() =>
              openModalWith('UnlockChunks', { bondFor: 'pool' }, 'small')
            }
            text={String(totalUnlockChuncks ?? 0)}
          />
        </ButtonRowWrapper>
      </CardHeaderWrapper>
      <BondedGraph
        active={planckToUnit(active, units)}
        unlocking={planckToUnit(totalUnlocking, units)}
        unlocked={planckToUnit(totalUnlocked, units)}
        free={planckToUnit(freeBalance, units)}
        inactive={!isMember()}
      />
    </>
  );
};

export default ManageBond;
