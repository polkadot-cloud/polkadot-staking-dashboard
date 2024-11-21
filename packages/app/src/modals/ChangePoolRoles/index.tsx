// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useTxMeta } from 'contexts/TxMeta';
import { useEffect } from 'react';
import { useOverlay } from 'kits/Overlay/Provider';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { RoleChange } from './RoleChange';
import { Wrapper } from './Wrapper';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ApiController } from 'controllers/Api';
import { useNetwork } from 'contexts/Network';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';

export const ChangePoolRoles = () => {
  const { t } = useTranslation('modals');
  const { network } = useNetwork();
  const { notEnoughFunds } = useTxMeta();
  const { replacePoolRoles } = useBondedPools();
  const { activeAccount } = useActiveAccounts();
  const {
    setModalStatus,
    config: { options },
    setModalResize,
  } = useOverlay().modal;
  const { id: poolId, roleEdits } = options;

  // tx to submit
  const getTx = () => {
    const { pApi } = ApiController.get(network);
    let tx = null;
    if (!pApi) {
      return tx;
    }

    const removeOp = { type: 'Remove' };
    const root = roleEdits?.root?.newAddress
      ? { type: 'Set', value: roleEdits.root.newAddress }
      : removeOp;
    const nominator = roleEdits?.nominator?.newAddress
      ? { type: 'Set', value: roleEdits.nominator.newAddress }
      : removeOp;
    const bouncer = roleEdits?.bouncer?.newAddress
      ? { type: 'Set', value: roleEdits.bouncer.newAddress }
      : removeOp;

    tx = pApi.tx.NominationPools.update_roles({
      pool_id: poolId,
      new_root: root,
      new_nominator: nominator,
      new_bouncer: bouncer,
    });
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
