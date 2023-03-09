// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useBalances } from 'contexts/Accounts/Balances';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTxFees } from 'contexts/TxFees';
import { AccountDropdown } from 'library/Form/AccountDropdown';
import { InputItem } from 'library/Form/types';
import { getEligibleControllers } from 'library/Form/Utils/getEligibleControllers';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { PaddingWrapper, WarningsWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wrapper } from './Wrapper';

export const UpdateController = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, getAccount, accountHasSigner } = useConnect();
  const { getBondedAccount } = useBalances();
  const { txFeesValid } = useTxFees();

  const controller = getBondedAccount(activeAccount);
  const account = getAccount(controller);

  // the selected value in the form
  const [selected, setSelected] = useState<InputItem>(null);

  // get eligible controller accounts
  const items = getEligibleControllers();

  // reset selected value on account change
  useEffect(() => {
    setSelected(null);
  }, [activeAccount, items]);

  // handle account selection change
  const handleOnChange = (item: InputItem) => {
    setSelected(item);
  };

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!selected || !api) {
      return tx;
    }
    const controllerToSubmit = {
      Id: selected?.address ?? '',
    };
    tx = api.tx.staking.setController(controllerToSubmit);
    return tx;
  };

  // handle extrinsic
  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  return (
    <>
      <Close />
      <PaddingWrapper>
        <h2 className="title unbounded">{t('changeControllerAccount')}</h2>
        <Wrapper>
          <div style={{ width: '100%' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              {!accountHasSigner(activeAccount) ? (
                <WarningsWrapper>
                  <Warning text={t('readOnly')} />
                </WarningsWrapper>
              ) : null}
            </div>
            <AccountDropdown
              items={items}
              onChange={handleOnChange}
              current={account}
              selected={selected}
              height="17rem"
            />
          </div>
        </Wrapper>
      </PaddingWrapper>
      <SubmitTx
        buttons={[
          <ButtonSubmit
            key="button_submit"
            text={`${submitting ? t('submitting') : t('submit')}`}
            iconLeft={faArrowAltCircleUp}
            iconTransform="grow-2"
            onClick={() => submitTx()}
            disabled={
              selected === null ||
              !selected.active ||
              submitting ||
              !accountHasSigner(activeAccount) ||
              !txFeesValid
            }
          />,
        ]}
      />
    </>
  );
};
