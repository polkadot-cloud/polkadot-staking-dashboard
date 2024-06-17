// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { planckToUnit } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import type { ForwardedRef } from 'react';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import { useOverlay } from 'kits/Overlay/Provider';
import { useBatchCall } from 'hooks/useBatchCall';
import type { AnyApi } from 'types';
import { usePayouts } from 'contexts/Payouts';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import type { FormProps, ActivePayout } from './types';
import { ContentWrapper } from './Wrappers';
import { SubscanController } from 'controllers/SubscanController';
import { ButtonSubmitInvert } from 'kits/Buttons/ButtonSubmitInvert';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { ActionItem } from 'library/ActionItem';

export const Forms = forwardRef(
  (
    { setSection, payouts, setPayouts }: FormProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { t } = useTranslation('modals');
    const { api } = useApi();
    const {
      networkData: { units, unit },
    } = useNetwork();
    const { newBatchCall } = useBatchCall();
    const { removeEraPayout } = usePayouts();
    const { setModalStatus } = useOverlay().modal;
    const { activeAccount } = useActiveAccounts();
    const { getSignerWarnings } = useSignerWarnings();

    // Get the total payout amount.
    const totalPayout =
      payouts?.reduce(
        (total: BigNumber, cur: ActivePayout) => total.plus(cur.payout),
        new BigNumber(0)
      ) || new BigNumber(0);

    // Get the total number of validators to payout (the same validator can repeat for separate
    // eras).
    const totalPayoutValidators =
      payouts?.reduce(
        (prev, { paginatedValidators }) =>
          prev + (paginatedValidators?.length || 0),
        0
      ) || 0;

    const getCalls = () => {
      if (!api) {
        return [];
      }

      const calls: AnyApi[] = [];
      payouts?.forEach(({ era, paginatedValidators }) => {
        if (!paginatedValidators) {
          return [];
        }
        return paginatedValidators.forEach(([page, v]) =>
          calls.push(api.tx.staking.payoutStakersByPage(v, era, page))
        );
      });
      return calls;
    };

    // Store whether form is valid to submit transaction.
    const [valid, setValid] = useState<boolean>(
      totalPayout.isGreaterThan(0) && totalPayoutValidators > 0
    );

    // Ensure payouts value is valid.
    useEffect(
      () => setValid(totalPayout.isGreaterThan(0) && totalPayoutValidators > 0),
      [payouts]
    );

    const getTx = () => {
      const tx = null;
      const calls = getCalls();
      if (!valid || !api || !calls.length) {
        return tx;
      }

      return calls.length === 1
        ? calls.pop()
        : newBatchCall(calls, activeAccount);
    };

    const submitExtrinsic = useSubmitExtrinsic({
      tx: getTx(),
      from: activeAccount,
      shouldSubmit: valid,
      callbackSubmit: () => {
        setModalStatus('closing');
      },
      callbackInBlock: () => {
        if (payouts && activeAccount) {
          // Remove Subscan unclaimed payout record(s) if they exist.
          const eraPayouts: string[] = [];
          payouts.forEach(({ era }) => {
            eraPayouts.push(String(era));
          });
          SubscanController.removeUnclaimedPayouts(activeAccount, eraPayouts);

          // Deduct from `unclaimedPayouts` in Payouts context.
          payouts.forEach(({ era, paginatedValidators }) => {
            for (const v of paginatedValidators || []) {
              removeEraPayout(era, v[1]);
            }
          });
        }
        // Reset active form payouts for this modal.
        setPayouts([]);
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
          <ModalPadding horizontalOnly>
            {warnings.length > 0 ? (
              <ModalWarnings withMargin>
                {warnings.map((text, i) => (
                  <Warning key={`warning${i}`} text={text} />
                ))}
              </ModalWarnings>
            ) : null}
            <div style={{ marginBottom: '2rem' }}>
              <ActionItem
                text={`${t('claim')} ${planckToUnit(
                  totalPayout,
                  units
                )} ${unit}`}
              />
              <p>{t('afterClaiming')}</p>
            </div>
          </ModalPadding>
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
  }
);

Forms.displayName = 'Forms';
