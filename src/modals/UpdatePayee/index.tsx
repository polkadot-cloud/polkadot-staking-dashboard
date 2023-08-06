// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ModalPadding, ModalWarnings } from '@polkadotcloud/core-ui';
import { isValidAddress } from '@polkadotcloud/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import type { PayeeConfig, PayeeOptions } from 'contexts/Setup/types';
import { useStaking } from 'contexts/Staking';
import { Warning } from 'library/Form/Warning';
import { usePayeeConfig } from 'library/Hooks/usePayeeConfig';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { PayeeInput } from 'library/PayeeInput';
import { SelectItems } from 'library/SelectItems';
import { SelectItem } from 'library/SelectItems/Item';
import { SubmitTx } from 'library/SubmitTx';
import type { MaybeAccount } from 'types';

export const UpdatePayee = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { activeAccount } = useConnect();
  const { getBondedAccount } = useBonded();
  const { setStatus: setModalStatus } = useModal();
  const controller = getBondedAccount(activeAccount);
  const { staking } = useStaking();
  const { getPayeeItems } = usePayeeConfig();
  const { getSignerWarnings } = useSignerWarnings();
  const { payee } = staking;

  const DefaultSelected: PayeeConfig = {
    destination: null,
    account: null,
  };

  // Store the current user-inputted custom payout account.
  const [account, setAccount] = useState<MaybeAccount>(payee.account);

  // Store the currently selected payee option.
  const [selected, setSelected]: any = useState<PayeeConfig>(DefaultSelected);

  // update setup progress with payee config.
  const handleChangeDestination = (destination: PayeeOptions) => {
    setSelected({
      destination,
      account: isValidAddress(account || '') ? account : null,
    });
  };

  // update setup progress with payee account.
  const handleChangeAccount = (newAccount: MaybeAccount) => {
    setSelected({
      destination: selected?.destination ?? null,
      account: newAccount,
    });
  };

  // determine whether this section is completed.
  const isComplete = () =>
    selected.destination !== null &&
    !(selected.destination === 'Account' && selected.account === null);

  // Tx to submit.
  const getTx = () => {
    let tx = null;

    if (!api) {
      return tx;
    }
    const payeeToSubmit = !isComplete()
      ? 'Staked'
      : selected.destination === 'Account'
      ? {
          Account: selected.account,
        }
      : selected.destination;

    tx = api.tx.staking.setPayee(payeeToSubmit);
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
    shouldSubmit: isComplete(),
    callbackSubmit: () => {
      setModalStatus('closing');
    },
    callbackInBlock: () => {},
  });

  // Reset selected value on account change.
  useEffect(() => {
    setSelected(DefaultSelected);
  }, [activeAccount]);

  // Inject default value after component mount.
  useEffect(() => {
    const initialSelected = getPayeeItems(true).find(
      (item) => item.value === payee.destination
    );
    setSelected(
      initialSelected
        ? {
            destination: initialSelected.value,
            account,
          }
        : DefaultSelected
    );
  }, []);

  const warnings = getSignerWarnings(
    activeAccount,
    true,
    submitExtrinsic.proxySupported
  );

  return (
    <>
      <Title
        title={t('updatePayoutDestination')}
        helpKey="Payout Destination"
      />
      <ModalPadding style={{ paddingBottom: 0 }}>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        <div style={{ width: '100%', padding: '0 0.5rem' }}>
          <PayeeInput
            payee={selected}
            account={account}
            setAccount={setAccount}
            handleChange={handleChangeAccount}
          />
        </div>
        <SelectItems>
          {getPayeeItems(true).map((item) => (
            <SelectItem
              key={`payee_option_${item.value}`}
              account={account}
              setAccount={setAccount}
              selected={selected.destination === item.value}
              onClick={() => handleChangeDestination(item.value)}
              {...item}
            />
          ))}
        </SelectItems>
      </ModalPadding>
      <SubmitTx fromController valid={isComplete()} {...submitExtrinsic} />
    </>
  );
};
