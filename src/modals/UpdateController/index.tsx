// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useTxMeta } from 'contexts/TxMeta';
import { useEffect } from 'react';
import { useOverlay } from 'kits/Overlay/Provider';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { Switch } from './Switch';
import { Wrapper } from './Wrapper';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';

export const UpdateController = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { notEnoughFunds } = useTxMeta();
  const { getBondedAccount } = useBonded();
  const { activeAccount } = useActiveAccounts();
  const { getAccount } = useImportedAccounts();
  const { getSignerWarnings } = useSignerWarnings();
  const { setModalStatus, setModalResize } = useOverlay().modal;

  const controller = getBondedAccount(activeAccount);
  const account = getAccount(controller);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!api) {
      return tx;
    }

    tx = api.tx.staking.setController();
    return tx;
  };

  useEffect(() => setModalResize(), [notEnoughFunds]);

  // handle extrinsic
  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">{t('changeControllerAccount')}</h2>
        <Wrapper>
          <div style={{ width: '100%' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              {warnings.length > 0 ? (
                <ModalWarnings withMargin>
                  {warnings.map((text, i) => (
                    <Warning key={`warning${i}`} text={text} />
                  ))}
                </ModalWarnings>
              ) : null}
            </div>
            <Switch current={account} to={activeAccount} />
          </div>
        </Wrapper>
      </ModalPadding>
      <SubmitTx valid={activeAccount !== null} {...submitExtrinsic} />
    </>
  );
};
