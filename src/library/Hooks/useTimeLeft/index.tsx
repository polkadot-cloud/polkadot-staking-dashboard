// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setStateWithRef } from 'Utils';
import {
  TimeLeftAll,
  TimeleftDuration,
  TimeLeftFormatted,
  TimeLeftRaw,
} from './types';
import { getDuration } from './utils';

export const useTimeLeft = () => {
  const { network } = useApi();
  const { t, i18n } = useTranslation();

  // check whether timeleft is within a minute of finishing.
  const inLastHour = () => {
    const { days, hours } = getDuration(toRef.current);
    return !days && !hours;
  };

  // get the amount of seconds left if timeleft is in the last minute.
  const lastMinuteCountdown = () => {
    const { seconds } = getDuration(toRef.current);
    if (!inLastHour()) {
      return 60;
    }
    return seconds;
  };

  // calculate resulting timeleft object from latest duration.
  const getTimeleft = (c?: TimeleftDuration): TimeLeftAll => {
    const { days, hours, minutes, seconds } = c || getDuration(toRef.current);

    const raw: TimeLeftRaw = {
      days,
      hours,
      minutes,
    };
    const formatted: TimeLeftFormatted = {
      days: [days, t('time.day', { count: days, ns: 'base' })],
      hours: [hours, t('time.hr', { count: hours, ns: 'base' })],
      minutes: [minutes, t('time.min', { count: minutes, ns: 'base' })],
    };
    if (!days && !hours) {
      formatted.seconds = [
        seconds,
        t('time.second', { count: seconds, ns: 'base' }),
      ];
      raw.seconds = seconds;
    }

    return {
      raw,
      formatted,
    };
  };

  // the end time as a date.
  const [to, setTo] = useState<Date | null>(null);
  const toRef = useRef(to);

  // resulting timeleft object to be returned.
  const [timeleft, setTimeleft] = useState<TimeLeftAll>(getTimeleft());

  // timeleft refresh intervals.
  const [minInterval, setMinInterval] = useState<
    ReturnType<typeof setInterval> | undefined
  >(undefined);
  const minIntervalRef = useRef(minInterval);

  const [secInterval, setSecInterval] = useState<
    ReturnType<typeof setInterval> | undefined
  >(undefined);
  const secIntervalRef = useRef(secInterval);

  // refresh effects.
  useEffect(() => {
    if (inLastHour()) {
      // refresh timeleft every second.
      if (!secIntervalRef.current) {
        const interval = setInterval(() => {
          if (!inLastHour()) {
            clearInterval(secIntervalRef.current);
            setStateWithRef(undefined, setSecInterval, secIntervalRef);
          }
          setTimeleft(getTimeleft());
        }, 1000);

        setStateWithRef(interval, setSecInterval, secIntervalRef);
      }
    } else {
      setTimeleft(getTimeleft());
      // refresh timeleft every minute.
      if (!minIntervalRef.current) {
        const interval = setInterval(() => {
          if (inLastHour()) {
            clearInterval(minIntervalRef.current);
            setStateWithRef(undefined, setMinInterval, minIntervalRef);
          }
          setTimeleft(getTimeleft());
        }, 60000);
        setStateWithRef(interval, setMinInterval, minIntervalRef);
      }
    }
  }, [to, inLastHour(), lastMinuteCountdown(), network]);

  // re-render the timeleft upon langauge switch.
  useEffect(() => {
    setTimeleft(getTimeleft());
  }, [i18n.resolvedLanguage]);

  // clear intervals on unmount
  useEffect(() => {
    return () => {
      clearInterval(minInterval);
      clearInterval(secInterval);
    };
  }, []);

  const setFromNow = (dateTo: Date) => {
    setTimeleft(getTimeleft(getDuration(new Date())));
    setStateWithRef(dateTo, setTo, toRef);
  };

  return {
    setFromNow,
    timeleft,
  };
};
