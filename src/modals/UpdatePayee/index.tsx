// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Dropdown } from 'library/Form/Dropdown';
import { useStaking } from 'contexts/Staking';
import { useBalances } from 'contexts/Balances';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useConnect } from 'contexts/Connect';
import { PAYEE_STATUS } from 'consts';
import { Warning } from 'library/Form/Warning';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useTxFees } from 'contexts/TxFees';
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { FooterWrapper, PaddingWrapper } from '../Wrappers';

export const UpdatePayee = () => {
  const { api } = useApi();
  const { activeAccount } = useConnect();
  const { getBondedAccount } = useBalances();
  const { setStatus: setModalStatus } = useModal();
  const controller = getBondedAccount(activeAccount);
  const { staking, getControllerNotImported } = useStaking();
  const { txFeesValid } = useTxFees();
  const { t } = useTranslation('common');

  const { payee } = staking;

  const _selected: any = PAYEE_STATUS.find((item) => item.key === payee);
  const [selected, setSelected]: any = useState(null);

  // reset selected value on account change
  useEffect(() => {
    setSelected(null);
  }, [activeAccount]);

  // ensure selected key is valid
  useEffect(() => {
    const exists = PAYEE_STATUS.find((item) => item.key === selected?.key);
    setValid(exists !== undefined);
  }, [selected]);

  const handleOnChange = ({ selectedItem }: any) => {
    setSelected(selectedItem);
  };

  // bond valid
  const [valid, setValid] = useState<boolean>(false);

  // tx to submit
  const tx = () => {
    let _tx = null;

    if (!api || !valid) {
      return _tx;
    }

    _tx = api.tx.staking.setPayee(selected.key);
    return _tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: controller,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  // remove active payee option from selectable items
  const payeeItems = PAYEE_STATUS.filter((item) => {
    return item.key !== _selected.key;
  });

  return (
    <>
      <Title title="Update Reward Destination" icon={faWallet} />
      <PaddingWrapper verticalOnly>
        <div
          style={{
            padding: '0 1.25rem',
            marginTop: '1rem',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {getControllerNotImported(controller) && (
            <Warning text={t('modals.w12')} />
          )}
          <Dropdown
            items={payeeItems}
            onChange={handleOnChange}
            placeholder={t('modals.reward_destination')}
            value={selected}
            current={_selected}
            height="17rem"
          />
          <div style={{ marginTop: '1rem' }}>
            <EstimatedTxFee />
          </div>
          <FooterWrapper>
            <div>
              <button
                type="button"
                className="submit"
                onClick={() => submitTx()}
                disabled={
                  !valid ||
                  submitting ||
                  getControllerNotImported(controller) ||
                  !txFeesValid
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
      </PaddingWrapper>
    </>
  );
};

export default UpdatePayee;
