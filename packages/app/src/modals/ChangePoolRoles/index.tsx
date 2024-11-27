// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useTxMeta } from 'contexts/TxMeta';
import { ApiController } from 'controllers/Api';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RoleChange } from './RoleChange';
import { Wrapper } from './Wrapper';

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
    const api = ApiController.getApi(network);
    let tx = null;
    if (!api) {
      return tx;
    }

    tx = api.tx.NominationPools.update_roles({
      pool_id: poolId,
      new_root: roleEdits?.root?.newAddress
        ? { type: 'Set', value: roleEdits.root.newAddress }
        : { type: 'Remove', value: undefined },

      new_nominator: roleEdits?.nominator?.newAddress
        ? { type: 'Set', value: roleEdits.nominator.newAddress }
        : { type: 'Remove', value: undefined },

      new_bouncer: roleEdits?.bouncer?.newAddress
        ? { type: 'Set', value: roleEdits.bouncer.newAddress }
        : { type: 'Remove', value: undefined },
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
