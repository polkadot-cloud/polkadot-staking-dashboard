// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonOption, Polkicon } from '@polkadot-cloud/react';
import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useTransferOptions } from 'contexts/TransferOptions';
import { Warning } from 'library/Form/Warning';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { ButtonRowWrapper, ContentWrapper } from './Wrappers';
import type { TasksProps } from './types';
import { useApi } from 'contexts/Api';
import { ellipsisFn, remToUnit } from '@polkadot-cloud/utils';
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress';

export const Tasks = forwardRef(
  ({ setSection, setTask }: TasksProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { t } = useTranslation('modals');
    const { activeAccount } = useActiveAccounts();
    const { getTransferOptions } = useTransferOptions();
    const { globalMaxCommission } = useApi().poolsConfig;
    const { activePool, isOwner, isBouncer, isMember, isDepositor } =
      useActivePool();

    const { active } = getTransferOptions(activeAccount).pool;

    const poolLocked = activePool?.bondedPool?.state === 'Blocked';
    const poolDestroying = activePool?.bondedPool?.state === 'Destroying';

    const stash = activePool?.addresses.stash || '';
    const reward = activePool?.addresses.reward || '';

    return (
      <ContentWrapper>
        <div ref={ref}>
          <div className="items" style={{ paddingBottom: '1rem' }}>
            {poolDestroying && (
              <div style={{ marginBottom: '0.75rem' }}>
                <Warning text={t('beingDestroyed')} />
              </div>
            )}

            <ButtonRowWrapper>
              <section>
                <div className="inner">
                  <span className="icon">
                    <Polkicon address={stash} size={remToUnit('3rem')} />
                  </span>
                  <div>
                    <h3>
                      Pool Stash Address <CopyAddress address={stash} />
                    </h3>
                    <h4>{ellipsisFn(stash, 5)}</h4>
                  </div>
                </div>
              </section>
              <section>
                <div className="inner">
                  <span className="icon">
                    <Polkicon address={reward} size={remToUnit('3rem')} />
                  </span>
                  <div>
                    <h3>
                      Pool Reward Address <CopyAddress address={reward} />
                    </h3>
                    <h4>{ellipsisFn(reward, 5)}</h4>
                  </div>
                </div>
              </section>
            </ButtonRowWrapper>

            {isOwner() && globalMaxCommission > 0 && (
              <>
                <ButtonOption
                  onClick={() => {
                    setSection(1);
                    setTask('claim_commission');
                  }}
                >
                  <div>
                    <h3>{t('claimCommission')}</h3>
                    <p>{t('claimOutstandingCommission')}</p>
                  </div>
                </ButtonOption>
                <ButtonOption
                  onClick={() => {
                    setSection(1);
                    setTask('manage_commission');
                  }}
                >
                  <div>
                    <h3>{t('manageCommission')}</h3>
                    <p>{t('updatePoolCommission')}</p>
                  </div>
                </ButtonOption>
              </>
            )}
            <ButtonOption
              onClick={() => {
                setSection(1);
                setTask('set_claim_permission');
              }}
            >
              <div>
                <h3>{t('updateClaimPermission')}</h3>
                <p>{t('updateWhoClaimRewards')}</p>
              </div>
            </ButtonOption>

            {isOwner() && (
              <ButtonOption
                disabled={poolDestroying}
                onClick={() => {
                  setSection(1);
                  setTask('set_pool_metadata');
                }}
              >
                <div>
                  <h3>{t('renamePool')}</h3>
                  <p>{t('updateName')}</p>
                </div>
              </ButtonOption>
            )}
            {(isOwner() || isBouncer()) && (
              <>
                {poolLocked ? (
                  <ButtonOption
                    disabled={poolDestroying}
                    onClick={() => {
                      setSection(1);
                      setTask('unlock_pool');
                    }}
                  >
                    <div>
                      <h3>{t('unlockPool')}</h3>
                      <p>{t('allowToJoin')}</p>
                    </div>
                  </ButtonOption>
                ) : (
                  <ButtonOption
                    disabled={poolDestroying}
                    onClick={() => {
                      setSection(1);
                      setTask('lock_pool');
                    }}
                  >
                    <div>
                      <h3>{t('lockPool')}</h3>
                      <p>{t('stopJoiningPool')}</p>
                    </div>
                  </ButtonOption>
                )}
                <ButtonOption
                  disabled={poolDestroying}
                  onClick={() => {
                    setSection(1);
                    setTask('destroy_pool');
                  }}
                >
                  <div>
                    <h3>{t('destroyPool')}</h3>
                    <p>{t('changeToDestroy')}</p>
                  </div>
                </ButtonOption>
              </>
            )}
            {isMember() && !isDepositor() && active?.isGreaterThan(0) && (
              <ButtonOption
                onClick={() => {
                  setSection(1);
                  setTask('leave_pool');
                }}
              >
                <div>
                  <h3>{t('leavePool')}</h3>
                  <p>{t('unbondFundsLeavePool')}</p>
                </div>
              </ButtonOption>
            )}
          </div>
        </div>
      </ContentWrapper>
    );
  }
);

Tasks.displayName = 'Tasks';
