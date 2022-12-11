// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit, toFixedIfNecessary } from 'Utils';
import { ReserveProps } from './types';
import { ReserveWrapper, SectionWrapper, Separator } from './Wrappers';

export const Reserve = (props: ReserveProps) => {
  const { height } = props;
  const { network } = useApi();
  const { existentialAmount } = useBalances();
  const { t } = useTranslation('pages');

  return (
    <SectionWrapper style={{ height }}>
      <ReserveWrapper>
        <Separator />
        <h4>
          {t('overview.reserved')}
          <OpenHelpIcon helpKey="Reserve Balance" />
        </h4>

        <div className="inner">
          <section>
            <div className="reserve">
              <h3>
                <FontAwesomeIcon
                  icon={faLock}
                  transform="shrink-2"
                  className="icon"
                />
                {`${toFixedIfNecessary(
                  planckBnToUnit(existentialAmount, network.units),
                  5
                )} ${network.unit}`}
              </h3>
            </div>
          </section>
        </div>
      </ReserveWrapper>
    </SectionWrapper>
  );
};

export default Reserve;
