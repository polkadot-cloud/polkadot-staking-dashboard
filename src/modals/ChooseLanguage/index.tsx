// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable */
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from 'locale';
import { useModal } from 'contexts/Modal';
import { ReactComponent as LanguageSVG } from 'img/language.svg';
import moment from 'moment';
import { useEffect } from 'react';
import { PaddingWrapper } from '../Wrappers';
import { ContentWrapper, LocaleButton } from './Wrapper';

export const ChooseLanguage = () => {
  const { i18n, t } = useTranslation(['common', 'pages', 'help']);
  const { setStatus } = useModal();

  useEffect(() => {
    i18n.resolvedLanguage === 'cn'
      ? moment.locale('cn', {
        months:
          '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
            '_'
          ),
        monthsShort:
          '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split(
          '_'
        ),
        weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
        weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
        longDateFormat: {
          LT: 'HH:mm',
          LTS: 'HH:mm:ss',
          L: 'YYYY-MM-DD',
          LL: 'YYYY年MM月DD日',
          LLL: 'YYYY年MM月DD日Ah点mm分',
          LLLL: 'YYYY年MM月DD日ddddAh点mm分',
          l: 'YYYY-M-D',
          ll: 'YYYY年M月D日',
          lll: 'YYYY年M月D日 HH:mm',
          llll: 'YYYY年M月D日dddd HH:mm',
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: (hour: any, meridiem: any) => {
          if (hour === 12) {
            hour = 0;
          }
          if (
            meridiem === '凌晨' ||
            meridiem === '早上' ||
            meridiem === '上午'
          ) {
            return hour;
          }
          if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12;
          }
          // '中午'
          return hour >= 11 ? hour : hour + 12;
        },
        meridiem: (hour, minute) => {
          const hm = hour * 100 + minute;
          if (hm < 600) {
            return '凌晨';
          }
          if (hm < 900) {
            return '早上';
          }
          if (hm < 1130) {
            return '上午';
          }
          if (hm < 1230) {
            return '中午';
          }
          if (hm < 1800) {
            return '下午';
          }
          return '晚上';
        },
        calendar: {
          sameDay: '[今天]LT',
          nextDay: '[明天]LT',
          nextWeek: '[下]ddddLT',
          lastDay: '[昨天]LT',
          lastWeek: '[上]ddddLT',
          sameElse: 'L',
        },
        dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,

        relativeTime: {
          future: '%s内',
          past: '%s前',
          s: '几秒',
          ss: '%d秒',
          m: '1分钟',
          mm: '%d分钟',
          h: '1小时',
          hh: '%d小时',
          d: '1天',
          dd: '%d天',
          M: '1个月',
          MM: '%d个月',
          y: '1年',
          yy: '%d年',
        },
        week: {
          dow: 1, // Monday is the first day of the week.
          doy: 4, // The week that contains Jan 4th is the first week of the year.
        },
      })
      : '';
  }, [i18n.resolvedLanguage]);

  return (
    <>
      <Title title={t('modals.choose_language')} Svg={LanguageSVG} />
      <PaddingWrapper>
        <ContentWrapper>
          <div className="item">
            {availableLanguages.map((l: string, i: number) => (
              <h3 key={`${l}_{i}`}>
                <LocaleButton
                  connected={i18n.resolvedLanguage === l}
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage(l);
                    setStatus(2);
                    localStorage.setItem('locale', l);
                  }}
                >
                  {availableLanguages[i].toUpperCase()}
                  {i18n.resolvedLanguage === l && (
                    <h4 className="selected">{t('modals.selected')}</h4>
                  )}
                </LocaleButton>
              </h3>
            ))}
          </div>
        </ContentWrapper>
      </PaddingWrapper>
    </>
  );
};
