// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { ImportedAccount } from 'contexts/Connect/types';
import { useModal } from 'contexts/Modal';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { AccountDropdown } from 'library/Form/AccountDropdown';
import { InputItem } from 'library/Form/types';
import { getEligibleControllers } from 'library/Form/Utils/getEligibleControllers';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { useEffect, useState } from 'react';
import { FooterWrapper, NotesWrapper } from '../Wrappers';
import Wrapper from './Wrapper';

export const UpdateController = () => {
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, getAccount, accountHasSigner } = useConnect();
  const { getBondedAccount } = useBalances();
  const { txFeesValid } = useTxFees();

  const controller = getBondedAccount(activeAccount);
  const account = getAccount(controller);

  // the selected value in the form
  const [selected, setSelected] = useState<ImportedAccount | null>(null);

  // get eligible controller accounts
  const items = getEligibleControllers();

  // reset selected value on account change
  useEffect(() => {
    setSelected(null);
  }, [activeAccount, items]);

  // handle account selection change
  const handleOnChange = ({ selectedItem }: { selectedItem: InputItem }) => {
    setSelected(selectedItem);
  };

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!selected || !api) {
      return _tx;
    }
    const controllerToSubmit = {
      Id: selected?.address ?? '',
    };
    _tx = api.tx.staking.setController(controllerToSubmit);
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
    callbackInBlock: () => {},
  });

  return (
    <>
      <Title
        title="Change Controller Account"
        icon={faExchangeAlt}
        helpKey="Controller Account Eligibility"
      />
      <Wrapper>
        <div
          style={{ padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            {!accountHasSigner(activeAccount) && (
              <Warning text="Your stash account is read only and cannot sign transactions." />
            )}
          </div>
          <AccountDropdown
            items={items}
            onChange={handleOnChange}
            placeholder="Search Account"
            current={account}
            value={selected}
            height="17rem"
          />
          <NotesWrapper>
            <EstimatedTxFee />
          </NotesWrapper>
          <FooterWrapper>
            <div>
              <button
                type="button"
                className="submit primary"
                onClick={() => submitTx()}
                disabled={
                  selected === null ||
                  submitting ||
                  !accountHasSigner(activeAccount) ||
                  !txFeesValid
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

export default UpdateController;
