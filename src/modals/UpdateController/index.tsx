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
import { useApi } from 'contexts/Api';
import { APIContextInterface } from 'types/api';
import { HeadingWrapper, FooterWrapper, NotesWrapper } from '../Wrappers';
import Wrapper from './Wrapper';

export const UpdateController = () => {
  const { api } = useApi() as APIContextInterface;
  const { setStatus: setModalStatus }: any = useModal();
  const { accounts, activeAccount, getAccount } = useConnect();
  const { getBondedAccount, isController }: any = useBalances();
  const controller = getBondedAccount(activeAccount);
  const account = getAccount(controller);

  // the selected value in the form
  const [selected, setSelected]: any = useState(null);

  // reset selected value on account change
  useEffect(() => {
    setSelected(null);
  }, [activeAccount]);

  // handle account selection change
  const handleOnChange = ({ selectedItem }: any) => {
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
  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  // remove active controller from selectable items
  const accountsList = accounts.filter((acc: any) => {
    return acc.address !== activeAccount && !isController(acc.address);
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
        <AccountDropdown
          items={accountsList.filter(
            (acc: any) => acc.address !== activeAccount
          )}
          onChange={handleOnChange}
          placeholder="Search Account"
          current={account}
          value={selected}
          height="17rem"
        />
        <NotesWrapper>
          <p>
            Estimated Tx Fee:
            {estimatedFee === null ? '...' : `${estimatedFee}`}
          </p>
        </NotesWrapper>
        <FooterWrapper>
          <div>
            <button
              type="button"
              className="submit"
              onClick={() => submitTx()}
              disabled={selected === null || submitting}
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
