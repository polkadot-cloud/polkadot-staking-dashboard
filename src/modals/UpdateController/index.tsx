// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ModalPadding, ModalWarnings } from '@polkadotcloud/core-ui';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useTranslation } from 'react-i18next';
import { Switch } from './Switch';
import { Wrapper } from './Wrapper';

export const UpdateController = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, getAccount } = useConnect();
  const { getBondedAccount } = useBonded();
  const { getSignerWarnings } = useSignerWarnings();

  const controller = getBondedAccount(activeAccount);
  const account = getAccount(controller);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!api) {
      return tx;
    }
    const controllerToSubmit = {
      Id: activeAccount ?? '',
    };
    tx = api.tx.staking.setController(controllerToSubmit);
    return tx;
  };

  // handle extrinsic
  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
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
