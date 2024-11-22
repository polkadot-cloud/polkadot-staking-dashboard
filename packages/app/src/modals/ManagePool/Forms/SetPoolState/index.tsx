// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { SubmitTx } from 'library/SubmitTx';
import { useOverlay } from 'kits/Overlay/Provider';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { ButtonSubmitInvert } from 'ui-buttons';
import { ActionItem } from 'library/ActionItem';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { ApiController } from 'controllers/Api';
import { useNetwork } from 'contexts/Network';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';

export const SetPoolState = ({
  setSection,
  task = '',
}: {
  setSection: Dispatch<SetStateAction<number>>;
  task?: string;
}) => {
  const { t } = useTranslation('modals');
  const { network } = useNetwork();
  const { setModalStatus } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { getSignerWarnings } = useSignerWarnings();
  const { isOwner, isBouncer, activePool } = useActivePool();
  const { updateBondedPools, getBondedPool } = useBondedPools();

  const poolId = activePool?.id;

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // ensure account has relevant roles for task
  const canToggle =
    (isOwner() || isBouncer()) &&
    ['destroy_pool', 'unlock_pool', 'lock_pool'].includes(task);

  useEffect(() => {
    setValid(canToggle);
  }, [canToggle]);

  const content = (() => {
    let title;
    let message;
    switch (task) {
      case 'destroy_pool':
        title = <ActionItem text={t('setToDestroying')} />;
        message = <p>{t('setToDestroyingSubtitle')}</p>;
        break;
      case 'unlock_pool':
        title = <ActionItem text={t('unlockPool')} />;
        message = <p>{t('unlockPoolSubtitle')}</p>;
        break;
      default:
        title = <ActionItem text={t('lockPool')} />;
        message = <p>{t('lockPoolSubtitle')}</p>;
    }
    return { title, message };
  })();

  const poolStateFromTask = (s: string) => {
    switch (s) {
      case 'destroy_pool':
        return 'Destroying';
      case 'lock_pool':
        return 'Blocked';
      default:
        return 'Open';
    }
  };

  // tx to submit
  const getTx = () => {
    const { pApi } = ApiController.get(network);
    if (!valid || !pApi || poolId === undefined) {
      return null;
    }

    let tx;
    switch (task) {
      case 'destroy_pool':
        tx = pApi.tx.NominationPools.set_state({
          pool_id: poolId,
          state: { type: 'Destroying', value: undefined },
        });
        break;
      case 'unlock_pool':
        tx = pApi.tx.NominationPools.set_state({
          pool_id: poolId,
          state: { type: 'Open', value: undefined },
        });
        break;
      case 'lock_pool':
        tx = pApi.tx.NominationPools.set_state({
          pool_id: poolId,
          state: { type: 'Blocked', value: undefined },
        });
        break;
      default:
        tx = null;
    }
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
    callbackInBlock: () => {
      // reflect updated state in `bondedPools` list.
      if (
        ['destroy_pool', 'unlock_pool', 'lock_pool'].includes(task) &&
        poolId
      ) {
        const pool = getBondedPool(poolId);
        if (pool) {
          updateBondedPools([
            {
              ...pool,
              state: poolStateFromTask(task),
            },
          ]);
        }
      }
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  return (
    <>
      <ModalPadding horizontalOnly>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        {content.title}
        {content.message}
      </ModalPadding>
      <SubmitTx
        valid={valid}
        buttons={[
          <ButtonSubmitInvert
            key="button_back"
            text={t('back')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-1"
            onClick={() => setSection(0)}
          />,
        ]}
        {...submitExtrinsic}
      />
    </>
  );
};
