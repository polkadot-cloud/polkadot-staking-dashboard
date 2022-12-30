// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getUnixTime, intervalToDuration } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setStateWithRef } from 'Utils';
import { defaultDuration } from './defaults';
import {
  TimeLeftAll,
  TimeleftDuration,
  TimeLeftFormatted,
  TimeleftProps,
  TimeLeftRaw,
} from './types';

export const useTimeLeft = (initial: TimeleftProps) => {
  const { t } = useTranslation();

  // adds `seconds` to the current time and returns the resulting date.
  const fromNow = (seconds: number): Date => {
    const end = new Date();
    end.setSeconds(end.getSeconds() + seconds);
    return end;
  };

  // calculates the current timeleft duration.
  const getDuration = (toDate: Date | null): TimeleftDuration => {
    if (!toDate) return defaultDuration;

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
  const inLastMinute = () => {
    const { days, hours, minutes } = durationRef.current;
    return !days && !hours && !minutes;
  };

  // get the amount of seconds left if timeleft is in the last minute.
  const lastMinuteCountdown = () => {
    const { seconds } = durationRef.current;
    if (!durationRef.current)
      if (!inLastMinute) {
        return 60;
      }
    return seconds;
  };

  // calculate resulting timeleft object from latest duration.
  const getTimeleft = (d: TimeleftDuration): TimeLeftAll => {
    const { days, hours, minutes, seconds } = d;

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
  const [to, setTo] = useState<Date | null>(fromNow(initial));

  // the the duration object of timeleft.
  const [duration, setDuration] = useState<TimeleftDuration>(defaultDuration);
  const durationRef = useRef(duration);

  // resulting timeleft object to be returned.
  const [timeleft, setTimeleft] = useState<TimeLeftAll>(
    getTimeleft(durationRef.current)
  );

  // timeleft refresh intervals.
  let minInterval: ReturnType<typeof setInterval>;
  let secInterval: ReturnType<typeof setInterval>;

  // refresh every minute, or every second if in last minute.
  useEffect(() => {
    if (inLastMinute()) {
      // refresh timeleft every second
      secInterval = setInterval(() => {
        if (!inLastMinute()) {
          clearInterval(secInterval);
        }
        setTimeleft(getTimeleft(durationRef.current));
      }, 1000);
    } else {
      setTimeleft(getTimeleft(durationRef.current));
      // refresh timeleft every minute.
      minInterval = setInterval(() => {
        if (inLastMinute()) {
          clearInterval(minInterval);
        }
        setTimeleft(getTimeleft(durationRef.current));
      }, 60000);
    }
    return () => {
      clearInterval(minInterval);
      clearInterval(secInterval);
    };
  }, [
    duration,
    durationRef.current.minutes,
    inLastMinute(),
    lastMinuteCountdown(),
  ]);

  // update duration if `to` date changes.
  useEffect(() => {
    setStateWithRef(getDuration(to), setDuration, durationRef);
  }, [to]);

  // update component when duration updates.
  useEffect(() => {
    setTimeleft(getTimeleft(durationRef.current));
  }, [duration]);

  // format the duration as a string.
  const timeleftAsString = (() => {
    const { days, hours, minutes, seconds } = durationRef.current;

    let str = '';
    if (days > 0) {
      str += `${days} ${t('time.day', { count: days, ns: 'base' })} `;
    }
    str += `${hours} ${t('time.hr', { count: hours, ns: 'base' })} `;
    str += `${minutes} ${t('time.min', { count: minutes, ns: 'base' })}`;

    if (!days && !hours) {
      str += ` ${seconds}`;
    }
    return str;
  })();

  return {
    setTo,
    fromNow,
    timeleft,
    timeleftAsString,
  };
};
