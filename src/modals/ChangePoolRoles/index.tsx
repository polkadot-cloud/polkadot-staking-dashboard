// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { PaddingWrapper } from 'modals/Wrappers';
import { useTranslation } from 'react-i18next';
import { RoleChange } from './RoleChange';
import { Wrapper } from './Wrapper';

export const ChangePoolRoles = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { replacePoolRoles } = useBondedPools();
  const { activeAccount } = useConnect();
  const { config } = useModal();
  const { id: poolId, roleEdits } = config;

  // tx to submit
  const getTx = () => {
    let tx = null;
    const root = roleEdits?.root?.newAddress
      ? { Set: roleEdits?.root?.newAddress }
      : 'Remove';
    const nominator = roleEdits?.nominator?.newAddress
      ? { Set: roleEdits?.nominator?.newAddress }
      : 'Remove';
    const stateToggler = roleEdits?.stateToggler?.newAddress
      ? { Set: roleEdits?.stateToggler?.newAddress }
      : 'Remove';

    tx = api?.tx.nominationPools?.updateRoles(
      poolId,
      root,
      nominator,
      stateToggler
    );
    return tx;
  };

  // handle extrinsic
  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {
      // manually update bondedPools with new pool roles
      replacePoolRoles(poolId, roleEdits);
    },
  });

  return (
    <>
      <Close />
      <PaddingWrapper>
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
            roleName={t('stateToggler')}
            oldAddress={roleEdits?.stateToggler?.oldAddress}
            newAddress={roleEdits?.stateToggler?.newAddress}
          />
        </Wrapper>
      </PaddingWrapper>
      <SubmitTx {...submitExtrinsic} valid />
    </>
  );
};
