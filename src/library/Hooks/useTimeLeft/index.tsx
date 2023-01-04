// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getUnixTime, intervalToDuration } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setStateWithRef } from 'Utils';
import { defaultDuration, defaultRefreshInterval } from './defaults';
import {
  TimeLeftAll,
  TimeleftDuration,
  TimeLeftFormatted,
  TimeleftHookProps,
  TimeLeftRaw,
} from './types';

export const useTimeLeft = (props?: TimeleftHookProps) => {
  const { t, i18n } = useTranslation();

  // adds `seconds` to the current time and returns the resulting date.
  const fromNow = (seconds: number): Date => {
    const end = new Date();
    end.setSeconds(end.getSeconds() + seconds);
    return end;
  };

  // calculates the current timeleft duration.
  const getDuration = (toDate: Date | null): TimeleftDuration => {
    if (!toDate) {
      return defaultDuration;
    }
    if (getUnixTime(toDate) <= getUnixTime(new Date())) {
      return defaultDuration;
    }
    toDate.setSeconds(toDate.getSeconds());
    const d = intervalToDuration({
      start: Date.now(),
      end: toDate,
    });

    const days = d?.days || 0;
    const hours = d?.hours || 0;
    const minutes = d?.minutes || 0;
    const seconds = d?.seconds || 0;
    const lastHour = days === 0 && hours === 0;
    const lastMinute = lastHour && minutes === 0;

    return {
      days,
      hours,
      minutes,
      seconds,
      lastMinute,
    };
  };

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

  // refresh callback interval in seconds.
  const refreshInterval = props?.refreshInterval || defaultRefreshInterval;

  // refresh interval counter, defaults to interval time.
  let r = refreshInterval;

  // refresh effects.
  useEffect(() => {
    // handler for handling timeleft refresh.
    //
    // either handle regular timeleft update, or refresh `to` via `refreshCallback` every
    // `refreshInterval` seconds.
    const handleRefresh = () => {
      // end of a refresh interval.
      if (r === 0) {
        // call refresh callback if one is present.
        const refreshCallback = props?.refreshCallback || undefined;
        if (refreshCallback) {
          setStateWithRef(fromNow(refreshCallback()), setTo, toRef);
        }
        r = refreshInterval;
      }
      setTimeleft(getTimeleft());
    };

    if (inLastHour()) {
      // refresh timeleft every second.
      if (!secIntervalRef.current) {
        const interval = setInterval(() => {
          if (!inLastHour()) {
            clearInterval(secIntervalRef.current);
            setStateWithRef(undefined, setSecInterval, secIntervalRef);
          }
          r = Math.max(0, r - 1);
          handleRefresh();
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
          r = Math.max(0, r - 60);
          handleRefresh();
        }, 60000);
        setStateWithRef(interval, setMinInterval, minIntervalRef);
      }
    }
  }, [to, inLastHour(), lastMinuteCountdown()]);

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

  // format the duration as a string.
  const timeleftAsString = (toDate?: Date, full?: boolean) => {
    const { days, hours, minutes, seconds } = getDuration(
      toDate || toRef.current
    );

    let str = '';
    if (days > 0) {
      str += `${days} ${t('time.day', { count: days, ns: 'base' })} `;
    }

    const tHour = `time.${full ? `hour` : `hr`}`;
    const tMinute = `time.${full ? `minute` : `min`}`;

    if (hours > 0) {
      str += `${hours} ${t(tHour, { count: hours, ns: 'base' })} `;
    }
    if (minutes > 0) {
      `${minutes} ${t(tMinute, { count: minutes, ns: 'base' })}`;
    }

    if (!days && !hours) {
      str += ` ${seconds}`;
    }
    return str;
  };

  const setFromNow = (dateTo: Date) => {
    setTimeleft(getTimeleft(getDuration(new Date())));
    setStateWithRef(dateTo, setTo, toRef);
  };

  return {
    setFromNow,
    fromNow,
    timeleft,
    timeleftAsString,
  };
};
