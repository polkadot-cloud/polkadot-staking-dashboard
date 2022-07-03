// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import { AccountDropdown } from 'library/Form/AccountDropdown';
import { useBalances } from 'contexts/Balances';
import { useModal } from 'contexts/Modal';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { getEligibleControllers } from 'library/Form/Utils/getEligibleControllers';
import { useApi } from 'contexts/Api';
import { ConnectContextInterface, ImportedAccount } from 'types/connect';
import { BalancesContextInterface } from 'types/balances';
import { Warning } from 'library/Form/Warning';
import { InputItem } from 'library/Form/types';
import { HeadingWrapper, FooterWrapper, NotesWrapper } from '../Wrappers';
import Wrapper from './Wrapper';

export const UpdateController = () => {
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, getAccount, accountHasSigner } =
    useConnect() as ConnectContextInterface;
  const { getBondedAccount } = useBalances() as BalancesContextInterface;
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
  const { submitTx, estimatedFee, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  return (
    <Wrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform="grow-2" icon={faExchangeAlt} />
        Change Controller Account
      </HeadingWrapper>
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
          <p>
            Estimated Tx Fee:{' '}
            {estimatedFee === null ? '...' : `${estimatedFee}`}
          </p>
        </NotesWrapper>
        <FooterWrapper>
          <div>
            <button
              type="button"
              className="submit"
              onClick={() => submitTx()}
              disabled={
                selected === null ||
                submitting ||
                !accountHasSigner(activeAccount)
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
  );
};

export default UpdateController;
