// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalPadding } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useTxMeta } from 'contexts/TxMeta';
import { useEffect } from 'react';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { RoleChange } from './RoleChange';
import { Wrapper } from './Wrapper';

export const ChangePoolRoles = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { activeAccount } = useActiveAccounts();
  const { notEnoughFunds } = useTxMeta();
  const { replacePoolRoles } = useBondedPools();
  const {
    setModalStatus,
    config: { options },
    setModalResize,
  } = useOverlay().modal;
  const { id: poolId, roleEdits } = options;

  // tx to submit
  const getTx = () => {
    let tx = null;
    const root = roleEdits?.root?.newAddress
      ? { Set: roleEdits?.root?.newAddress }
      : 'Remove';
    const nominator = roleEdits?.nominator?.newAddress
      ? { Set: roleEdits?.nominator?.newAddress }
      : 'Remove';
    const bouncer = roleEdits?.bouncer?.newAddress
      ? { Set: roleEdits?.bouncer?.newAddress }
      : 'Remove';

    tx = api?.tx.nominationPools?.updateRoles(poolId, root, nominator, bouncer);
    return tx;
  };

  // handle extrinsic
  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
    callbackInBlock: () => {
      // manually update bondedPools with new pool roles
      replacePoolRoles(poolId, roleEdits);
    },
  });

  useEffect(() => setModalResize(), [notEnoughFunds]);

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">{t('changePoolRoles')}</h2>
        <Wrapper>
          <RoleChange
            roleName={t('root')}
            oldAddress={roleEdits?.root?.oldAddress}
            newAddress={roleEdits?.root?.newAddress}
          />
          <RoleChange
            roleName={t('nominator')}
            oldAddress={roleEdits?.nominator?.oldAddress}
            newAddress={roleEdits?.nominator?.newAddress}
          />
          <RoleChange
            roleName={t('bouncer')}
            oldAddress={roleEdits?.bouncer?.oldAddress}
            newAddress={roleEdits?.bouncer?.newAddress}
          />
        </Wrapper>
      </ModalPadding>
      <SubmitTx {...submitExtrinsic} valid />
    </>
  );
};
