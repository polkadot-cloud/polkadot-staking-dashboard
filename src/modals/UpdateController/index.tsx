// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useBalances } from 'contexts/Accounts/Balances';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { PaddingWrapper, WarningsWrapper } from 'modals/Wrappers';
import { useTranslation } from 'react-i18next';
import { Switch } from './Switch';
import { Wrapper } from './Wrapper';

export const UpdateController = () => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount, getAccount, accountHasSigner } = useConnect();
  const { getBondedAccount } = useBalances();

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
                  <Warning text={t('readOnlyCannotSign')} />
                </WarningsWrapper>
              ) : null}
            </div>
            <Switch current={account} to={activeAccount} />
          </div>
        </Wrapper>
      </PaddingWrapper>
      <SubmitTx valid={activeAccount !== null} {...submitExtrinsic} />
    </>
  );
};
