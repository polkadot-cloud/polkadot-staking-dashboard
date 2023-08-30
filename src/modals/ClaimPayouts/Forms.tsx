// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import {
  ActionItem,
  ButtonSubmitInvert,
  ModalWarnings,
} from '@polkadot-cloud/react';
import { planckToUnit } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { ContentWrapper } from './Wrappers';

export const Forms = forwardRef(({ setSection, payout }: any, ref: any) => {
  const { t } = useTranslation('modals');
  const { setModalStatus } = useOverlay().modal;
  const { api, network } = useApi();
  const { activeAccount } = useConnect();
  const { getSignerWarnings } = useSignerWarnings();
  const { units } = network;

  // TODO: Update to real values.
  const validator = payout?.validator ?? '';
  const value = payout?.value ?? new BigNumber(0);

  // Store whether form is valid to submit transaction.
  const [valid, setValid] = useState<boolean>(value.isGreaterThan(0));

  // Ensure payout value is valid.
  useEffect(() => {
    setValid(value.isGreaterThan(0));
  }, [payout]);

  const getTx = () => {
    const tx = null;
    if (!valid || !api) return tx;
    return api.tx.staking.payoutStakers(validator, '1180');
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
    callbackInBlock: () => {
      // TODO: Remove subscan unclaimed payout record if it exists & subscan is enabled.
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  return (
    <ContentWrapper>
      <div ref={ref}>
        <div className="padding">
          {warnings.length > 0 ? (
            <ModalWarnings withMargin>
              {warnings.map((text, i) => (
                <Warning key={`warning${i}`} text={text} />
              ))}
            </ModalWarnings>
          ) : null}
          <div style={{ marginBottom: '2rem' }}>
            <ActionItem
              text={`${t('withdraw')} ${planckToUnit(value, units)} ${
                network.unit
              }`}
            />
            <p>{t('withdrawSubtitle')}</p>
          </div>
        </div>
        <SubmitTx
          fromController={false}
          valid={valid}
          buttons={[
            <ButtonSubmitInvert
              key="button_back"
              text={t('back')}
              iconLeft={faChevronLeft}
              iconTransform="shrink-1"
              onClick={() => setSection(0)}
            />,
          ]}
          {...submitExtrinsic}
        />
      </div>
    </ContentWrapper>
  );
});
