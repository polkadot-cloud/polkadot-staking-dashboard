// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useTranslation } from 'react-i18next';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { FooterWrapper, NotesWrapper } from '../Wrappers';
import { RoleChange } from './RoleChange';
import Wrapper from './Wrapper';

export const ChangePoolRoles = () => {
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { replacePoolRoles } = useBondedPools();
  const { activeAccount, accountHasSigner } = useConnect();
  const { config } = useModal();
  const { txFeesValid } = useTxFees();
  const { id: poolId, roleEdits } = config;
  const { t } = useTranslation('common');

  // tx to submit
  const tx = () => {
    let _tx = null;
    const root = roleEdits?.root?.newAddress
      ? { Set: roleEdits?.root?.newAddress }
      : 'Remove';
    const nominator = roleEdits?.nominator?.newAddress
      ? { Set: roleEdits?.nominator?.newAddress }
      : 'Remove';
    const stateToggler = roleEdits?.stateToggler?.newAddress
      ? { Set: roleEdits?.stateToggler?.newAddress }
      : 'Remove';

    _tx = api?.tx.nominationPools?.updateRoles(
      poolId,
      root,
      nominator,
      stateToggler
    );
    return _tx;
  };

  // handle extrinsic
  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
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
      <Title title={t('modals.change_pool_roles')} icon={faExchangeAlt} />
      <Wrapper>
        <div
          style={{
            padding: '0 1.25rem',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <RoleChange
            roleName={t('modals.root')}
            oldAddress={roleEdits?.root?.oldAddress}
            newAddress={roleEdits?.root?.newAddress}
          />
          <RoleChange
            roleName={t('modals.nominator')}
            oldAddress={roleEdits?.nominator?.oldAddress}
            newAddress={roleEdits?.nominator?.newAddress}
          />
          <RoleChange
            roleName={t('modals.state_toggler')}
            oldAddress={roleEdits?.stateToggler?.oldAddress}
            newAddress={roleEdits?.stateToggler?.newAddress}
          />
          <NotesWrapper>
            <EstimatedTxFee />
          </NotesWrapper>
          <FooterWrapper>
            <div>
              <button
                type="button"
                className="submit"
                onClick={() => submitTx()}
                disabled={
                  submitting || !accountHasSigner(activeAccount) || !txFeesValid
                }
              >
                <FontAwesomeIcon
                  transform="grow-2"
                  icon={faArrowAltCircleUp as IconProp}
                />
                {t('modals.submit')}
              </button>
            </div>
          </FooterWrapper>
        </div>
      </Wrapper>
    </>
  );
};

export default ChangePoolRoles;
