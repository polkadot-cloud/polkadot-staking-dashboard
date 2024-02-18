// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ActionItem, ModalPadding, ModalWarnings } from '@polkadot-cloud/react';
import { planckToUnit, rmCommas } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { ForwardedRef } from 'react';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useFavoritePools } from 'contexts/Pools/FavoritePools';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { ContentWrapper } from './Wrappers';
import type { FormsProps } from './types';
import { useBalances } from 'contexts/Balances';
import { ButtonSubmitInvert } from 'library/Buttons/ButtonSubmitInvert';

export const Forms = forwardRef(
  (
    { setSection, unlock, task, incrementCalculateHeight }: FormsProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { t } = useTranslation('modals');
    const { api, consts } = useApi();
    const {
      networkData: { units, unit },
    } = useNetwork();
    const { activePool } = useActivePool();
    const { activeAccount } = useActiveAccounts();
    const { removePoolMember } = usePoolMembers();
    const { removeFromBondedPools } = useBondedPools();
    const {
      setModalStatus,
      config: { options },
    } = useOverlay().modal;
    const { getBondedAccount } = useBonded();
    const { getPoolMembership } = useBalances();
    const { getSignerWarnings } = useSignerWarnings();
    const { removeFavorite: removeFavoritePool } = useFavoritePools();

    const membership = getPoolMembership(activeAccount);
    const { bondFor, poolClosure } = options || {};
    const { historyDepth } = consts;
    const controller = getBondedAccount(activeAccount);

    const isStaking = bondFor === 'nominator';
    const isPooling = bondFor === 'pool';

    // valid to submit transaction
    const [valid, setValid] = useState<boolean>(
      (unlock?.value?.toNumber() || 0) > 0 || false
    );

    // tx to submit
    const getTx = () => {
      let tx = null;
      if (!valid || !api || !unlock) {
        return tx;
      }
      // rebond is only available when staking directly.
      if (task === 'rebond' && isStaking) {
        tx = api.tx.staking.rebond(unlock.value.toNumber() || 0);
      } else if (task === 'withdraw' && isStaking) {
        tx = api.tx.staking.withdrawUnbonded(historyDepth.toString());
      } else if (task === 'withdraw' && isPooling && activePool) {
        tx = api.tx.nominationPools.withdrawUnbonded(
          activeAccount,
          historyDepth.toString()
        );
      }
      return tx;
    };
    const signingAccount = isStaking ? controller : activeAccount;
    const submitExtrinsic = useSubmitExtrinsic({
      tx: getTx(),
      from: signingAccount,
      shouldSubmit: valid,
      callbackSubmit: () => {
        setModalStatus('closing');
      },
      callbackInBlock: () => {
        // if pool is being closed, remove from static lists
        if (poolClosure) {
          removeFavoritePool(activePool?.addresses?.stash ?? '');
          removeFromBondedPools(activePool?.id ?? 0);
        }

        // if no more bonded funds from pool, remove from poolMembers list
        if (bondFor === 'pool') {
          const points = membership?.points ? rmCommas(membership.points) : 0;
          const bonded = planckToUnit(new BigNumber(points), units);
          if (bonded.isZero()) {
            removePoolMember(activeAccount);
          }
        }
      },
    });

    const value = unlock?.value ?? new BigNumber(0);

    const warnings = getSignerWarnings(
      activeAccount,
      isStaking,
      submitExtrinsic.proxySupported
    );

    // Ensure unlock value is valid.
    useEffect(() => {
      setValid((unlock?.value?.toNumber() || 0) > 0 || false);
    }, [unlock]);

    // Trigger modal resize when commission options are enabled / disabled.
    useEffect(() => {
      incrementCalculateHeight();
    }, [valid]);

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
              {task === 'rebond' && (
                <>
                  <ActionItem
                    text={`${t('rebond')} ${planckToUnit(
                      value,
                      units
                    )} ${unit}`}
                  />
                  <p>{t('rebondSubtitle')}</p>
                </>
              )}
              {task === 'withdraw' && (
                <>
                  <ActionItem
                    text={`${t('withdraw')} ${planckToUnit(
                      value,
                      units
                    )} ${unit}`}
                  />
                  <p>{t('withdrawSubtitle')}</p>
                </>
              )}
            </div>
          </ModalPadding>
          <SubmitTx
            fromController={isStaking}
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
