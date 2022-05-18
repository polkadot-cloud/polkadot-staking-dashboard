// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import Wrapper from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountDropdown } from '../../library/Form/AccountDropdown';
import { useBalances } from '../../contexts/Balances';
import { useModal } from '../../contexts/Modal';
import { HeadingWrapper, FooterWrapper } from '../Wrappers';
import { useSubmitExtrinsic } from '../../library/Hooks/useSubmitExtrinsic';
import { useApi } from '../../contexts/Api';

export const UpdateController = () => {

  const { api }: any = useApi();
  const { setStatus: setModalStatus }: any = useModal();
  const { accounts, activeAccount, getAccount } = useConnect();
  const { getBondedAccount, isController }: any = useBalances();
  const controller = getBondedAccount(activeAccount);
  const account = getAccount(controller);

  const [selected, setSelected] = useState(account);

  isController(activeAccount);

  useEffect(() => {
    setSelected(account);
  }, [activeAccount]);

  const handleOnChange = ({ selectedItem }: any) => {
    setSelected(selectedItem);
  }

  // tx to submit
  const tx = () => {
    let tx = null;
    if (!selected) {
      return tx;
    }
    let controllerToSubmit = {
      Id: selected.address
    };

    // console.log(controllerToSubmit);
    tx = api.tx.staking.setController(controllerToSubmit);
    return tx;
  }

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {
    }
  });

  let accountsList = accounts.filter((acc: any) => {
    return acc.address !== activeAccount && !isController(acc.address);
  });

  return (
    <Wrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform='grow-2' icon={faExchangeAlt} />
        Change Controller Account
      </HeadingWrapper>
      <div style={{ padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}>
        <AccountDropdown
          items={accountsList.filter((acc: any) => acc.address !== activeAccount)}
          onChange={handleOnChange}
          placeholder='Select Account'
          value={selected}
          height='17rem'
        />
        <div style={{ marginTop: '1rem' }}>
          <p>Estimated Tx Fee: {estimatedFee === null ? '...' : `${estimatedFee}`}</p>
        </div>
        <FooterWrapper>
          <div>
            <button className='submit' onClick={() => submitTx()} disabled={selected === null || submitting}>
              <FontAwesomeIcon transform='grow-2' icon={faArrowAltCircleUp as IconProp} />
              Submit
            </button>
          </div>
        </FooterWrapper>
      </div>
    </Wrapper>
  )
}

export default UpdateController;