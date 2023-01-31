// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { PayeeConfig, PayeeOptions } from 'contexts/Setup/types';
import { useStaking } from 'contexts/Staking';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { PayeeItem, usePayeeConfig } from 'library/Hooks/usePayeeConfig';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { SelectItems } from 'library/SelectItems';
import { SelectItem } from 'library/SelectItems/Item';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MaybeAccount } from 'types';
import { FooterWrapper, PaddingWrapper, WarningsWrapper } from '../Wrappers';
import { Header } from './Header';

export const UpdatePayee = () => {
  const { t } = useTranslation();
  const { api } = useApi();
  const { activeAccount } = useConnect();
  const { getBondedAccount } = useBalances();
  const { setStatus: setModalStatus } = useModal();
  const controller = getBondedAccount(activeAccount);
  const { staking, getControllerNotImported } = useStaking();
  const { txFeesValid } = useTxFees();
  const { getPayeeItems } = usePayeeConfig();
  const { payee } = staking;

  // update setup progress with payee config.
  const handleChangeDestination = (destination: PayeeOptions) => {
    // set local value to update input element set setup payee
    setSelected({ destination, account });
  };

  // Store the current user-inputted custom payout account.
  const [account, setAccount] = useState<MaybeAccount>(payee.account);

  // Store the currently selected payee option.
  const [selected, setSelected]: any = useState<PayeeConfig | null>(null);

  // Store whether the selected option is valid.
  const [valid, setValid] = useState<boolean>(false);

  // Tx to submit.
  const getTx = () => {
    let tx = null;

    if (!api || !valid) {
      return tx;
    }
    tx = api.tx.staking.setPayee(selected.destination);
    return tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  // Reset selected value on account change.
  useEffect(() => {
    setSelected(null);
  }, [activeAccount]);

  // Inject default value after component mount.
  useEffect(() => {
    const defaultSelected = getPayeeItems(true).find(
      (item) => item.value === payee.destination
    );
    setSelected(
      defaultSelected
        ? {
            destination: defaultSelected.value,
            account,
          }
        : null
    );
  }, []);

  // Ensure selected item is valid on change.
  useEffect(() => {
    setValid(
      getPayeeItems(true).find(
        (item) => item.value === selected?.destination
      ) !== undefined
    );
  }, [selected]);

  return (
    <>
      <Title
        title="Update Payout Destination"
        icon={faWallet}
        helpKey="Reward Destination"
      />
      <PaddingWrapper verticalOnly>
        <div
          style={{
            padding: '0 1.25rem',
            marginTop: '1rem',
            width: '100%',
          }}
        >
          {getControllerNotImported(controller) && (
            <WarningsWrapper>
              <Warning text={t('mustHaveControllerUpdate', { ns: 'modals' })} />
            </WarningsWrapper>
          )}
          <Header
            current={payee?.destination}
            selected={selected?.destination}
          />
          <SelectItems>
            {getPayeeItems(true).map((item: PayeeItem) => (
              <SelectItem
                key={`payee_option_${item.value}`}
                account={account}
                setAccount={setAccount}
                selected={selected?.destination === item.value}
                onClick={() => handleChangeDestination(item.value)}
                {...item}
              />
            ))}
          </SelectItems>
          <div style={{ marginTop: '1rem' }}>
            <EstimatedTxFee />
          </div>
          <FooterWrapper>
            <div>
              <ButtonSubmit
                text={`${
                  submitting
                    ? t('submitting', { ns: 'modals' })
                    : t('submit', { ns: 'modals' })
                }`}
                iconLeft={faArrowAltCircleUp}
                iconTransform="grow-2"
                onClick={() => submitTx()}
                disabled={
                  !valid ||
                  submitting ||
                  getControllerNotImported(controller) ||
                  !txFeesValid
                }
              />
            </div>
          </FooterWrapper>
        </div>
      </PaddingWrapper>
    </>
  );
};
