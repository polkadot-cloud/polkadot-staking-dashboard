// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useBonded } from 'contexts/Bonded';
import { useNetwork } from 'contexts/Network';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useFavoritePools } from 'contexts/Pools/FavoritePools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { ApiController } from 'controllers/Api';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { ActionItem } from 'library/ActionItem';
import { Warning } from 'library/Form/Warning';
import { SubmitTx } from 'library/SubmitTx';
import { planckToUnitBn } from 'library/Utils';
import { forwardRef, useEffect, useState, type ForwardedRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSubmitInvert } from 'ui-buttons';
import type { FormsProps } from './types';
import { ContentWrapper } from './Wrappers';

export const Forms = forwardRef(
  (
    { setSection, unlock, task, incrementCalculateHeight }: FormsProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { t } = useTranslation('modals');
    const { consts } = useApi();
    const {
      network,
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
      const api = ApiController.getApi(network);
      let tx = null;
      if (!valid || !api || !unlock) {
        return tx;
      }
      // rebond is only available when staking directly.
      if (task === 'rebond' && isStaking) {
        tx = api.tx.Staking.rebond({
          value: BigInt(unlock.value.toNumber() || 0),
        });
      } else if (task === 'withdraw' && isStaking) {
        tx = api.tx.Staking.withdraw_unbonded({
          num_slashing_spans: historyDepth.toNumber(),
        });
      } else if (task === 'withdraw' && isPooling && activePool) {
        if (activeAccount) {
          tx = api.tx.NominationPools.withdraw_unbonded({
            member_account: {
              type: 'Id',
              value: activeAccount,
            },
            num_slashing_spans: historyDepth.toNumber(),
          });
        }
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
          const bonded = planckToUnitBn(new BigNumber(points), units);
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
                    text={`${t('rebond')} ${planckToUnitBn(
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
                    text={`${t('withdraw')} ${planckToUnitBn(
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
