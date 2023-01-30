// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnect } from 'contexts/Connect';
import { ImportedAccount } from 'contexts/Connect/types';
import { useSetup } from 'contexts/Setup';
import { Identicon } from 'library/Identicon';
import React, { useEffect, useRef, useState } from 'react';
import { isValidAddress, remToUnit } from 'Utils';
import { AccountInputProps } from './types';
import { AccountWrapper } from './Wrappers';

export const AccountInput = ({
  account,
  setAccount,
  handleChange,
}: AccountInputProps) => {
  const { getSetupProgress } = useSetup();
  const { activeAccount, formatAccountSs58, accounts } = useConnect();

  const setup = getSetupProgress('stake', activeAccount);
  const { payee } = setup.setup;

  const accountMeta = accounts.find(
    (a: ImportedAccount) => a.address === activeAccount
  );
  const accountDisplay =
    payee.destination === 'Account' ? account : activeAccount;

  // store whether account value is valid.
  const [valid, setValid] = useState<boolean>(isValidAddress(account || ''));

  // Store whether input is currently active.
  const [inputActive, setInputActive] = useState<boolean>(false);

  const hiddenRef = useRef<HTMLInputElement>(null);
  const showingRef = useRef<HTMLInputElement>(null);

  // Adjust the width of account input based on text length.
  const handleAdjustWidth = () => {
    if (hiddenRef.current && showingRef.current) {
      const hiddenWidth = hiddenRef.current.offsetWidth;
      showingRef.current.style.width = `${hiddenWidth + remToUnit('2.5rem')}px`;
    }
  };

  // Handle change of account value. Updates setup progress if the account is a valid value.
  const handleChangeAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    const formatted = formatAccountSs58(newAddress) || newAddress || null;
    const isValid = isValidAddress(formatted || '');

    setValid(isValid);
    setAccount(formatted);

    if (isValid) {
      handleChange(formatted);
    } else {
      handleChange(null);
    }
  };

  // Adjust width as ref values change.
  useEffect(() => {
    handleAdjustWidth();
  }, [hiddenRef.current, showingRef.current, payee.destination]);

  // Adjust width on window resize.
  useEffect(() => {
    window.addEventListener('resize', handleAdjustWidth);
    return () => {
      window.removeEventListener('resize', handleAdjustWidth);
    };
  }, []);

  return (
    <>
      <AccountWrapper activeInput={inputActive}>
        <div className="inner">
          <h4>Payout Account:</h4>
          <div className="account">
            {payee.destination === 'Account' && !valid ? (
              <div className="emptyIcon" />
            ) : (
              <Identicon
                value={accountDisplay || ''}
                size={remToUnit('2.5rem')}
              />
            )}
            <div className="input" ref={showingRef}>
              <input
                type="text"
                placeholder="Payout Address"
                disabled={payee.destination !== 'Account'}
                value={accountDisplay || ''}
                onFocus={() => setInputActive(true)}
                onBlur={() => setInputActive(false)}
                onChange={handleChangeAccount}
              />
              <div ref={hiddenRef} className="hidden">
                {payee.destination === 'Account'
                  ? activeAccount
                  : accountDisplay}
              </div>
            </div>
          </div>
        </div>
        <div className="label">
          <h5>
            {payee.destination === 'Account' ? (
              <>
                {account === '' ? (
                  'Insert a payout address'
                ) : !valid ? (
                  'Not a valid address'
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheck} />
                    Valid Address
                  </>
                )}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} />
                {accountMeta?.name || ''}
              </>
            )}
          </h5>
        </div>
      </AccountWrapper>
    </>
  );
};
