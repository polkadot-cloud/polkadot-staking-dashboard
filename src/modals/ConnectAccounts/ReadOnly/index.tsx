// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { ExternalAccount, ImportedAccount } from 'contexts/Connect/types';
import { faGlasses, faCog, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExtensionWrapper } from '../Wrappers';
import { Wrapper } from './Wrapper';
import { ReadOnlyInput } from '../ReadOnlyInput';

export const ReadOnly = (props: any) => {
  const { setReadOnlyOpen, readOnlyOpen } = props;

  const { accounts, forgetAccounts } = useConnect();

  // get all external accounts
  const externalAccountsOnly = accounts.filter((a: ImportedAccount) => {
    return a.source === 'external';
  }) as Array<ExternalAccount>;

  // get external accounts added by user
  const externalAccountsByUser = externalAccountsOnly.filter(
    (a: ExternalAccount) => a.addedBy === 'user'
  );

  // forget account
  const forgetAccount = (account: ExternalAccount) => {
    forgetAccounts([account]);
  };
  return (
    <Wrapper>
      <ExtensionWrapper noSpacing>
        <button
          type="button"
          onClick={() => {
            setReadOnlyOpen(!readOnlyOpen);
          }}
        >
          <div>
            <FontAwesomeIcon
              icon={faGlasses}
              transform="grow-5"
              style={{ margin: '0 1rem 0 1rem' }}
            />
            <h3>
              <span className="name">Read Only Accounts</span>
            </h3>
          </div>
          <div className="neutral">
            <h3>
              <span
                className={`message${
                  externalAccountsByUser.length ? ` success` : ``
                }`}
              >
                {externalAccountsByUser.length
                  ? `${externalAccountsByUser.length} Connected`
                  : ``}
              </span>
            </h3>
            <FontAwesomeIcon
              icon={readOnlyOpen ? faTimes : faCog}
              className="icon"
              style={{ marginRight: '0.75rem' }}
            />
          </div>
        </button>
      </ExtensionWrapper>
      {readOnlyOpen && (
        <div className="content">
          <ReadOnlyInput />
          {externalAccountsByUser.length > 0 && (
            <h5>
              {externalAccountsByUser.length} Read Only Account
              {externalAccountsByUser.length === 1 ? '' : 's'}
            </h5>
          )}
          <div className="accounts">
            {externalAccountsByUser.map((a: ExternalAccount, i: number) => (
              <button
                key={`user_external_account_${i}`}
                type="button"
                className="account"
                onClick={() => {
                  forgetAccount(a);
                }}
              >
                <div>{a.address}</div>
                <div>Forget</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </Wrapper>
  );
};
