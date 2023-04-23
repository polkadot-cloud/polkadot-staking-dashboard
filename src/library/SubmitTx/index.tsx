// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faPenToSquare, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useProxies } from 'contexts/Accounts/Proxies';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTxMeta } from 'contexts/TxMeta';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Default } from './Default';
import { ManualSign } from './ManualSign';
import { Wrapper } from './Wrappers';
import type { SubmitTxProps } from './types';

export const SubmitTx = ({
  uid,
  onSubmit,
  submitText,
  buttons = [],
  valid = false,
  noMargin = false,
  submitting = false,
  fromController = false,
}: SubmitTxProps) => {
  const { t } = useTranslation();
  const { unit } = useApi().network;
  const { notEnoughFunds, sender, setTxSignature } = useTxMeta();
  const { requiresManualSign, activeAccount, activeProxy } = useConnect();
  const { setResize } = useModal();
  const { getProxyDelegate } = useProxies();

  const displayNote = notEnoughFunds || fromController || activeProxy;
  submitText =
    submitText ||
    `${
      submitting
        ? t('submitting', { ns: 'modals' })
        : t('submit', { ns: 'modals' })
    }`;

  useEffect(() => {
    setResize();
  }, [notEnoughFunds, fromController]);

  // reset tx metadata on unmount
  useEffect(() => {
    return () => {
      // remove the pending tx signature
      setTxSignature(null);
    };
  }, []);

  const proxyDelegate = getProxyDelegate(activeAccount, activeProxy);

  return (
    <Wrapper noMargin={noMargin}>
      <div className="inner">
        {displayNote ? (
          <p className="sign">
            {activeProxy && (
              <>
                <FontAwesomeIcon icon={faPenToSquare} className="icon" />
                Signing from {proxyDelegate?.proxyType} proxy
              </>
            )}
            {fromController && (
              <>
                <FontAwesomeIcon icon={faPenToSquare} className="icon" />
                {t('signedByController', { ns: 'library' })}
              </>
            )}
            {notEnoughFunds && (
              <>
                {fromController ? ' / ' : null}
                <FontAwesomeIcon
                  icon={faWarning}
                  className="danger"
                  transform="shrink-1"
                />{' '}
                <span className="danger">
                  {t('notEnough', { ns: 'library' })} {unit}
                </span>
              </>
            )}
          </p>
        ) : null}
        <section className="foot">
          {requiresManualSign(sender) ? (
            <ManualSign
              uid={uid}
              onSubmit={onSubmit}
              submitting={submitting}
              valid={valid}
              submitText={submitText}
              buttons={buttons}
            />
          ) : (
            <Default
              onSubmit={onSubmit}
              submitting={submitting}
              valid={valid}
              submitText={submitText}
              buttons={buttons}
            />
          )}
        </section>
      </div>
    </Wrapper>
  );
};
