// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TimeLeftFormatted } from 'library/Hooks/useTimeLeft/types';
import { useTranslation } from 'react-i18next';

export const Countdown = ({ timeleft }: { timeleft: TimeLeftFormatted }) => {
  const { t } = useTranslation('base');
  const { days, hours, minutes, seconds } = timeleft;

  const secondsNumber = seconds ? seconds[0] : 0;
  const secondsLabel = seconds
    ? seconds[1]
    : t('second', { count: secondsNumber });

  return (
    <>
      {hours[0] > 0 ? (
        <>
          {hours[0]} <span>{hours[1]}</span>
        </>
      ) : null}
      {minutes[0] > 0 ? (
        <>
          {minutes[0]} <span>{minutes[1]}</span>
        </>
      ) : null}
      {days[0] === 0 && hours[0] === 0 && minutes[0] > 0 ? ' : ' : null}

      {days[0] === 0 && hours[0] === 0 && (
        <>
          {secondsNumber}
          {minutes[0] === 0 ? <span>{secondsLabel}</span> : null}
        </>
      )}
    </>
  );
};
