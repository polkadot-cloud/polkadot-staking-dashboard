// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlugins } from 'contexts/Plugins';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { PayoutBar } from 'library/Graphs/PayoutBar';
import { PayoutLine } from 'library/Graphs/PayoutLine';
import { formatSize } from 'library/Graphs/Utils';
import { GraphWrapper } from 'library/Graphs/Wrapper';
import { useSize } from 'library/Hooks/useSize';
import { StatusLabel } from 'library/StatusLabel';
import { useSubscanData } from 'library/Hooks/useSubscanData';

export const Payouts = () => {
  const { t } = useTranslation('pages');
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const notStaking = !isSyncing && inSetup();
  const { plugins } = usePlugins();

  // eslint-disable-next-line
  const data = useSubscanData(['payouts', 'unclaimedPayouts', 'poolClaims']);

  // Ref to the graph container.
  const graphInnerRef = useRef<HTMLDivElement>(null);

  const size = useSize(graphInnerRef?.current || undefined);
  const { width, height, minHeight } = formatSize(size, 260);

  return (
    <div className="inner" ref={graphInnerRef} style={{ minHeight }}>
      {!plugins.includes('subscan') ? (
        <StatusLabel
          status="active_service"
          statusFor="subscan"
          title={t('overview.subscanDisabled')}
          topOffset="37%"
        />
      ) : (
        <StatusLabel
          status="sync_or_setup"
          title={t('overview.notStaking')}
          topOffset="37%"
        />
      )}

      <GraphWrapper
        style={{
          height: `${height}px`,
          width: `${width}px`,
          position: 'absolute',
          opacity: notStaking ? 0.75 : 1,
          transition: 'opacity 0.5s',
        }}
      >
        <PayoutBar days={19} height="150px" />
        <div style={{ marginTop: '3rem' }}>
          <PayoutLine days={19} average={10} height="65px" />
        </div>
      </GraphWrapper>
    </div>
  );
};
