// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp, ButtonMonoInvert } from '@polkadotcloud/core-ui';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { ReactComponent as IconSVG } from 'img/ledgerIcon.svg';
import { useTranslation } from 'react-i18next';
import type { AnyJson } from 'types';
import { Addresess } from './Addresses';
import { StatusBarWrapper } from './Wrappers';

export const Manage = ({
  addresses,
  handleLedgerLoop,
  removeLedgerAddress,
}: AnyJson) => {
  const { t } = useTranslation('modals');
  const { replaceModalWith } = useModal();
  const { setIsExecuting, getIsExecuting, resetStatusCodes, getFeedback } =
    useLedgerHardware();
  const { openHelp } = useHelp();

  const isExecuting = getIsExecuting();

  const fallbackMessage = `${t('ledgerAccounts', { count: addresses.length })}`;
  const feedback = getFeedback();
  const helpKey = feedback?.helpKey;

  return (
    <>
      <Addresess
        addresses={addresses}
        handleLedgerLoop={handleLedgerLoop}
        removeLedgerAddress={removeLedgerAddress}
      />
      <StatusBarWrapper
        initial="hidden"
        animate="show"
        variants={{
          hidden: { bottom: -50 },
          show: {
            bottom: 0,
            transition: {
              staggerChildren: 0.01,
            },
          },
        }}
        transition={{
          duration: 2,
          type: 'spring',
          bounce: 0.4,
        }}
      >
        <div className="inner">
          <div>
            <IconSVG width="24" height="24" className="ledgerIcon" />
            <div className="text">
              <h3>
                {feedback?.message || fallbackMessage}
                {helpKey ? (
                  <ButtonHelp
                    marginLeft
                    onClick={() => openHelp(helpKey)}
                    backgroundSecondary
                  />
                ) : null}
              </h3>
            </div>
          </div>
          <div>
            {isExecuting ? (
              <ButtonMonoInvert
                text={t('cancel')}
                onClick={() => {
                  setIsExecuting(false);
                  resetStatusCodes();
                }}
              />
            ) : (
              <ButtonMonoInvert
                text={t('done')}
                onClick={() => {
                  replaceModalWith('Connect', { disableScroll: true }, 'large');
                }}
              />
            )}
          </div>
        </div>
      </StatusBarWrapper>
    </>
  );
};
