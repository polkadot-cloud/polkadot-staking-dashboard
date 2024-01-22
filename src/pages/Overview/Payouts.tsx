// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRef, useState } from 'react';
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
import { isCustomEvent } from 'static/utils';
import { useEventListener } from 'usehooks-ts';
import type { AnyJson } from 'types';
import { SubscanController } from 'static/SubscanController';
import type { PayoutType } from 'static/SubscanController/types';

export const Payouts = () => {
  const { t } = useTranslation('pages');
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const notStaking = !isSyncing && inSetup();
  const { plugins, pluginEnabled } = usePlugins();

  // Ref to the graph container.
  const graphInnerRef = useRef<HTMLDivElement>(null);

  // Store the most up to date state of payouts.
  // TODO: abstract `payoutData` into generic useSubscanData hook.
  // eslint-disable-next-line
  const [payoutsData, setPayoutsData] = useState<AnyJson>({});

  const size = useSize(graphInnerRef?.current || undefined);
  const { width, height, minHeight } = formatSize(size, 260);

  // Listen for updated payout callback. When there are new payouts, fetch the updated values
  // directly from `SubscanController` and commit to component state.
  const subscanPayoutsUpdatedCallback = (e: Event) => {
    // NOTE: Subscan has to be enabled to continue.
    if (isCustomEvent(e) && pluginEnabled('subscan')) {
      const { keys }: { keys: PayoutType[] } = e.detail;

      const payouts: Record<string, AnyJson> = keys.map((key) => ({
        [key]: SubscanController.payouts[key] || [],
      }));

      setPayoutsData(payouts);
    }
  };

  // Listen for new subscan data updates.
  const documentRef = useRef<Document>(document);
  useEventListener(
    'subscan-data-updated',
    subscanPayoutsUpdatedCallback,
    documentRef
  );

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
