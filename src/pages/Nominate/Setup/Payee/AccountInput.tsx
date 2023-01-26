// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnect } from 'contexts/Connect';
import { ImportedAccount } from 'contexts/Connect/types';
import { useSetup } from 'contexts/Setup';
import { Identicon } from 'library/Identicon';
import { useEffect, useRef, useState } from 'react';
import { isValidAddress, remToUnit } from 'Utils';
import { AccountWrapper } from './Wrappers';

export const AccountInput = () => {
  const { activeAccount, formatAccountSs58, accounts } = useConnect();
  const { getSetupProgress } = useSetup();
  const setup = getSetupProgress('stake', activeAccount);

  const accountMeta = accounts.find(
    (a: ImportedAccount) => a.address === activeAccount
  );

  // Store the current user-inputted custom payout account.
  const [value, setValue] = useState<string>('');
  const accountDisplay =
    setup.payee === 'Account' ? value : activeAccount || '';

  // Store whether input is currently active.
  const [inputActive, setInputActive] = useState<boolean>(false);

  // store whether account value is valid.
  const [valid, setValid] = useState<boolean>(false);

  const hiddenRef = useRef<HTMLInputElement>(null);
  const showingRef = useRef<HTMLInputElement>(null);

  // Adjust the width of account input based on text length.
  const handleAdjustWidth = () => {
    if (hiddenRef.current && showingRef.current) {
      const hiddenWidth = hiddenRef.current.offsetWidth;
      showingRef.current.style.width = `${hiddenWidth + remToUnit('2.5rem')}px`;
    }
  };

  // Adjust width as ref values change.
  useEffect(() => {
    handleAdjustWidth();
  }, [hiddenRef.current, showingRef.current, setup.payee]);

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
            {setup.payee === 'Account' && !valid ? (
              <div className="emptyIcon" />
            ) : (
              <Identicon value={accountDisplay} size={remToUnit('2.5rem')} />
            )}
            <div className="input" ref={showingRef}>
              <input
                type="text"
                placeholder="Payout Address"
                disabled={setup.payee !== 'Account'}
                value={accountDisplay}
                onFocus={() => setInputActive(true)}
                onBlur={() => setInputActive(false)}
                onChange={(e) => {
                  const newAddress = e.target.value;
                  const formatted = formatAccountSs58(newAddress) || newAddress;
                  const isValid = isValidAddress(formatted);
                  setValid(isValid);

                  if (isValid) {
                    setValue(formatted);
                  } else {
                    setValue(e.target.value);
                  }
                }}
              />
              <div ref={hiddenRef} className="hidden">
                {setup.payee === 'Account' ? activeAccount : accountDisplay}
              </div>
            </div>
          </div>
        </div>
        <h5>
          {setup.payee === 'Account' ? (
            <>
              {value === '' ? (
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
      </AccountWrapper>
    </>
  );
};
