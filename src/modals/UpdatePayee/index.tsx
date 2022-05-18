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

export const UpdatePayee = () => {
  const { api }: any = useApi();
  const { activeAccount } = useConnect();
  const { getBondedAccount }: any = useBalances();
  const { setStatus: setModalStatus }: any = useModal();
  const controller = getBondedAccount(activeAccount);
  const { staking } = useStaking();
  const { payee } = staking;

  const _selected: any = PAYEE_STATUS.find((item: any) => item.key === payee);
  const [selected, setSelected] = useState(_selected ?? null);

  // ensure selected key is valid
  useEffect(() => {
    const exists: any = PAYEE_STATUS.find((item: any) => item.key === selected?.key);
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

    if (!valid) {
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
    callbackInBlock: () => {
    },
  });

  return (
    <Wrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform="grow-2" icon={faWallet} />
        Update Reward Destination
      </HeadingWrapper>
      <div style={{ padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}>
        <div className="head">
          <h4>
            Currently Selected:
            {' '}
            {_selected?.name ?? 'None'}
          </h4>
        </div>
        <Dropdown
          items={PAYEE_STATUS}
          onChange={handleOnChange}
          placeholder="Reward Destination"
          value={selected}
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
            <button type="button" className="submit" onClick={() => submitTx()} disabled={!valid || submitting}>
              <FontAwesomeIcon transform="grow-2" icon={faArrowAltCircleUp as IconProp} />
              Submit
            </button>
          </div>
        </FooterWrapper>
      </div>
    </Wrapper>
  );
};

export default UpdatePayee;
