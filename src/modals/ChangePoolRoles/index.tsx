// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useApi } from 'contexts/Api';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useTxFees } from 'contexts/TxFees';
import { Title } from 'library/Modal/Title';
import { FooterWrapper, NotesWrapper } from '../Wrappers';
import Wrapper from './Wrapper';
import { RoleChange } from './RoleChange';

export const ChangePoolRoles = () => {
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { config } = useModal();
  const { txFeesValid } = useTxFees();
  const { poolId, roleEdits } = config;

  // tx to submit
  const tx = () => {
    let _tx = null;
    const nominator = roleEdits?.nominator?.newAddress
      ? { Set: roleEdits?.nominator?.newAddress }
      : 'Remove';
    const stateToggler = roleEdits?.stateToggler?.newAddress
      ? { Set: roleEdits?.stateToggler?.newAddress }
      : 'Remove';

    _tx = api?.tx.nominationPools?.updateRoles(
      poolId,
      'Noop',
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
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  return (
    <>
      <Title title="Change Pool Roles" icon={faExchangeAlt} />
      <Wrapper>
        <div
          style={{ padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}
        >
          <RoleChange
            roleName="Nominator"
            oldAddress={roleEdits?.nominator?.oldAddress}
            newAddress={roleEdits?.nominator?.newAddress}
          />
          <RoleChange
            roleName="State Toggler"
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
                Submit
              </button>
            </div>
          </FooterWrapper>
        </div>
      </Wrapper>
    </>
  );
};

export default ChangePoolRoles;
