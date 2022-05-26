// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { HeadingWrapper, FooterWrapper } from '../Wrappers';
import { Wrapper } from './Wrapper';
import { Dropdown } from '../../library/Form/Dropdown';
import { useStaking } from '../../contexts/Staking';
import { useBalances } from '../../contexts/Balances';
import { useApi } from '../../contexts/Api';
import { useModal } from '../../contexts/Modal';
import { useSubmitExtrinsic } from '../../library/Hooks/useSubmitExtrinsic';
import { useConnect } from '../../contexts/Connect';
import { PAYEE_STATUS } from '../../constants';
import { Warning } from '../../library/Form/Warning';
import { APIContextInterface } from '../../types/api';

export const UpdatePayee = () => {
  const { api } = useApi() as APIContextInterface;
  const { activeAccount } = useConnect();
  const { getBondedAccount }: any = useBalances();
  const { setStatus: setModalStatus }: any = useModal();
  const controller = getBondedAccount(activeAccount);
  const { staking, getControllerNotImported } = useStaking();
  const { payee } = staking;

  const _selected: any = PAYEE_STATUS.find((item: any) => item.key === payee);
  const [selected, setSelected]: any = useState(null);

  // reset selected value on account change
  useEffect(() => {
    setSelected(null);
  }, [activeAccount]);

  // ensure selected key is valid
  useEffect(() => {
    const exists: any = PAYEE_STATUS.find(
      (item: any) => item.key === selected?.key
    );
    setValid(exists !== undefined);
  }, [selected]);

  const handleOnChange = ({ selectedItem }: any) => {
    setSelected(selectedItem);
  };

  // bond valid
  const [valid, setValid]: any = useState(false);

  // tx to submit
  const tx = () => {
    let _tx = null;

    if (!api || !valid) {
      return _tx;
    }

    _tx = api.tx.staking.setPayee(selected.key);
    return _tx;
  };

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: controller,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  // remove active payee option from selectable items
  const payeeItems = PAYEE_STATUS.filter((item: any) => {
    return item.key !== _selected.key;
  });

  return (
    <Wrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform="grow-2" icon={faWallet} />
        Update Reward Destination
      </HeadingWrapper>
      <div
        style={{
          padding: '0 1rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {getControllerNotImported(controller) && (
          <Warning text="You must have your controller account imported to update your reward destination" />
        )}
        <Dropdown
          items={payeeItems}
          onChange={handleOnChange}
          placeholder="Reward Destination"
          value={selected}
          current={_selected}
          height="17rem"
        />
        <div>
          <p>
            Estimated Tx Fee:
            {estimatedFee === null ? '...' : `${estimatedFee}`}
          </p>
        </div>
        <FooterWrapper>
          <div>
            <button
              type="button"
              className="submit"
              onClick={() => submitTx()}
              disabled={
                !valid || submitting || getControllerNotImported(controller)
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

export default UpdatePayee;
