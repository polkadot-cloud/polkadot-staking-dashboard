/* eslint-disable */
// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { PageTitle } from 'library/PageTitle';
import { PageRowWrapper } from 'Wrappers';
import { PageProps } from '../types';
import { Wrapper } from './Wrappers';

const BoardToken = '2dda48aa-e149-da7b-f016-98e22279df1e';

const Feedback = (props: PageProps) => {
  const { page } = props;
  const { title } = page;

  useEffect(() => {
    (function (w: any, d: any, i: any, s: any) {
      // eslint-disable-next-line
      function l() {
        if (!d.getElementById(i)) {
          var f = d.getElementsByTagName(s)[0],
            e = d.createElement(s);
          (e.type = 'text/javascript'),
            (e.async = !0),
            (e.src = 'https://canny.io/sdk.js'),
            f.parentNode.insertBefore(e, f);
        }
      }
      // eslint-disable-next-line
      if ('function' != typeof w.Canny) {
        var c: any = function () {
          c.q.push(arguments);
        };
        (c.q = []),
          (w.Canny = c),
          'complete' === d.readyState
            ? l()
            : w.attachEvent
            ? w.attachEvent('onload', l)
            : w.addEventListener('load', l, !1);
      }
    })(window, document, 'canny-jssdk', 'script');

    // @ts-ignore
    Canny('render', {
      boardToken: BoardToken,
      basePath: null, // See step 2
      ssoToken: null, // See step 3
    });
  }, []);

  return (
    <Wrapper>
      <PageTitle title={title} />

      <PageRowWrapper className='page-padding'>
        <div data-canny style={{ width: '100%' }} />
      </PageRowWrapper>
    </Wrapper>
  );
};

export default Feedback;
