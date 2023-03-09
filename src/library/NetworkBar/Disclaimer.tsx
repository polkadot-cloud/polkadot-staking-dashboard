// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors

import { Title } from 'library/Overlay/Title';
import { PaddingWrapper } from 'modals/Wrappers';

export const Disclaimer = () => (
  <>
    <Title title="Disclaimer" />
    <PaddingWrapper>
      <p>
        This Polkadot Staking Dashboard (“Dashboard”) is made available free of
        charge by Web 3.0 Technologies Foundation, Parity Technologies Limited
        and their affiliates (&quot;Web3 entities&quot;) as open source software
        under the Apache 2.0 licence found{' '}
        <a
          href="https://www.apache.org/licenses/LICENSE-2.0"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>{' '}
        (a copy of the dashboard code is{' '}
        <a
          href="https://github.com/paritytech/polkadot-staking-dashboard"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        ).
      </p>
      <p>
        THE DASHBOARD ALLOWS USERS TO JOIN NOMINATION POOLS BUT IS NOT ITSELF A
        STAKING SERVICE. BY USING THE DASHBOARD YOU ARE DEEMED TO HAVE: (I)
        READ, UNDERSTOOD AND AGREED TO THE DISCLAIMER BELOW and THE DASHBOARD
        DOCUMENTATION found{' '}
        <a
          href="https://wiki.polkadot.network/docs/learn-nomination-pools"
          target="_blank"
          rel="noreferrer"
        >
          HERE
        </a>
        ; AND (II) ACKNOWLEDGED THE RISKS ASSOCIATED WITH USING THE DASHBOARD
        AND BLOCKCHAIN TECHNOLOGY.
      </p>
      <p>
        Without prejudice to the Apache 2.0 licence, the dashboard and any
        information provided by or in connection with it (“content”) are
        PROVIDED ON AN &apos;AS IS&apos; AND &apos;AS AVAILABLE&apos; BASIS AND
        YOU ARE SOLELY RESPONSIBLE FOR ALL DECISIONS AND ACTIONS YOU TAKE
        REGARDING your USE of the dashboard and content.
      </p>
      <p>
        To the maximum extent permitted by applicable law, the Web3 entities,
        their OFFICERS, EMPLOYEES AND PERSONNEL: (i) make no warranty, condition
        or representation in relation to the dashboard or Content, whether in
        regards to its accuracy, outcomes, fitness for purpose, suitability,
        non-infringement or otherwise; (ii) accept no RESPONSIBILITY for any
        consequences (including without limitation any loss of your DOT, whether
        by slashing or otherwise) arising from your use of the dashboard or
        content or the acts, omissions or decisions of other users of the
        dashboard or nomination pools, such as depositors, nominators,
        state-togglers and roots (&quot;third party acts&quot;) which may impact
        you; and (iii) have no liability (including without limitation under
        negligence) for any loss or damage (whether direct, indirect or
        otherwise) that you may suffer or incur in connection with third party
        acts or your use of the dashboard or Content.
      </p>
      <p>
        as between you and the Web3 entities, your sole and exclusive remedy if
        you are not satisfied with the dashboard or content or have suffered
        loss or damage as a result of the dashboard, content or third party acts
        is to cease using the dashboard.
      </p>
    </PaddingWrapper>
  </>
);
