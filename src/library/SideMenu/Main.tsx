// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageCategories, PagesConfig } from 'config/pages';
import { BaseURL, CreditcoinUrl } from 'consts';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useSetup } from 'contexts/Setup';
import type { SetupContextInterface } from 'contexts/Setup/types';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import type { UIContextInterface } from 'contexts/UI/types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { PageCategory, PageItem, PagesConfigItems } from 'types';
import { Heading } from './Heading/Heading';
import { Primary } from './Primary';
import { LogoWrapper } from './Wrapper';

export const Main = () => {
  const { t, i18n } = useTranslation('base');
  const { network } = useApi();
  const { activeAccount, accounts } = useConnect();
  const { pathname } = useLocation();
  const { getBondedAccount } = useBonded();
  const { inSetup: inNominatorSetup, addressDifferentToStash } = useStaking();
  const { membership } = usePoolMemberships();
  const controller = getBondedAccount(activeAccount);
  const {
    onNominatorSetup,
    onPoolSetup,
    getPoolSetupPercent,
    getNominatorSetupPercent,
  }: SetupContextInterface = useSetup();
  const { isSyncing, sideMenuMinimised }: UIContextInterface = useUi();
  const controllerDifferentToStash = addressDifferentToStash(controller);

  const [pageConfig, setPageConfig] = useState({
    categories: Object.assign(PageCategories),
    pages: Object.assign(PagesConfig),
  });

  useEffect(() => {
    if (!accounts.length) return;

    // inject actions into menu items
    const _pages = Object.assign(pageConfig.pages);
    for (let i = 0; i < _pages.length; i++) {
      const { uri } = _pages[i];

      // set undefined action as default
      _pages[i].action = undefined;
      if (uri === `${BaseURL}/`) {
        const warning = !isSyncing && controllerDifferentToStash;
        if (warning) {
          _pages[i].action = {
            type: 'bullet',
            status: 'warning',
          };
        }
      }

      if (uri === `${BaseURL}/nominate`) {
        // configure Stake action
        const staking = !inNominatorSetup();
        const warning = !isSyncing && controllerDifferentToStash;
        const setupPercent = getNominatorSetupPercent(activeAccount);

        if (staking) {
          _pages[i].action = {
            type: 'text',
            status: 'success',
            text: t('active'),
          };
        }
        if (warning) {
          _pages[i].action = {
            type: 'bullet',
            status: 'warning',
          };
        }
        if (!staking && (onNominatorSetup || setupPercent > 0)) {
          _pages[i].action = {
            type: 'text',
            status: 'warning',
            text: `${setupPercent}%`,
          };
        }
      }

      if (uri === `${BaseURL}/pools`) {
        // configure Pools action
        const inPool = membership;
        const setupPercent = getPoolSetupPercent(activeAccount);

        if (inPool) {
          _pages[i].action = {
            type: 'text',
            status: 'success',
            text: t('active'),
          };
        }
        if (!inPool && (setupPercent > 0 || onPoolSetup)) {
          _pages[i].action = {
            type: 'text',
            status: 'warning',
            text: `${setupPercent}%`,
          };
        }
      }
    }
    setPageConfig({
      categories: pageConfig.categories,
      pages: _pages,
    });
  }, [
    network,
    activeAccount,
    accounts,
    controllerDifferentToStash,
    isSyncing,
    membership,
    inNominatorSetup(),
    getNominatorSetupPercent(activeAccount),
    getPoolSetupPercent(activeAccount),
    i18n.resolvedLanguage,
    onNominatorSetup,
    onPoolSetup,
  ]);

  // remove pages that network does not support
  const pagesToDisplay: PagesConfigItems = Object.values(pageConfig.pages);

  return (
    <>
      <LogoWrapper
        onClick={() => {
          window.open(CreditcoinUrl, '_blank');
        }}
        minimised={sideMenuMinimised}
      >
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAT4AAABICAYAAABvNJlYAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA1zSURBVHgB7Z3/dds4EsfHefn/3MGyg3grCFPBuYPTVRBfBVYqiFOBtRXEWwGVCpKtgEwFylbwPU4Armlo8IsiKTKaz3t4kigABEFyOABmhlc0IwCu24+iTWWbfrPfb+zfhZO9adMPm7616Tt/Xl1d7UlRFGXJsLBr012bqjYdMA5VmzZtKkhRFGUJOMJuaioWgqQoinIOrMC7x3iaXQ613XdBiqIoU3NmgedSt+meFEVRpqIVMqUVNkujblNJiqIoYwGj5X3E8uE2XpOiKIrligYAM49W0bEJSipsorIna6JCz2YrLjd2H2/s96ECrGnTu6urq4YURVFygRnaDpnLq9q0bdMNDYTLwqwWf0U+3OZbUhRFyaEVHO+RBwubB0ww19bWWbRph3zuSFEUJQWYVdscgcfa3eRzawMFoK76KooSBnmaXoUz2NINEICq+SmKItMKiNtEQXJYgjCBmQNMnYMsSVEUpY/VolKESI0FeUzYdtcJ7T4sqd2KopwZGDu9FOHBK6yLs5Ozwi9l9bdeYvsVRTkDSDNOXqTQ67DCO0X4fSRFUS4bGFu9VQu9jgzhV5KiKJcL4kNc/r+glYC0YXu9BkGuTIO9Rop+IuVyQNxeb5ULAggv1PD2DSkXC4zd6YsHISm/LK/7P6xA20TKfFijzyu3uT2+D+3X/nwe+wd/atND+/8PWhlWQ72xif2Zr+nZn5mPp2nTFzIh+xtSFOWYBG3vkVYOnqNCV2vUXBmYOdgKeT7TNTRcv5chGp+9XypoFPBs7DX82fbdezoniM+DFbRyYIa8Ja0QGGPy2DlKQV32HHIFH2SrBw2CkQBkp4jzWFbAaAMhVq/trRUYYV1hXGqo9vcPyBd8Ek+kRIHR9CRmW1zsz/H9J5L3AymzAxPG6zOFYx/u2/QXmdiGHXwRvaXnmIYuvK1q69c4hcPgOVT3Rv0XKesBRqMIodreGYCJPxhaiU6KgAOjzdeeerakDNH4HoS+3ETK/Jxm6aXBsSnXDGQ74fllDOLD3IKUWUHY35iHCtnDAuHm1gg1Fgxb3GDh99WmaF/iOHpQRReKlTlf7TWe9ACfohEV/HwlZXYwkYZmLzKu+yK1DR+YwY5PBd/CQBjVCmYGfg18SyMA9VA5QgXfZfEacdOOPc2AvRm71KzRoHhEJHOTfdsnWxqBC+9bRaFXZFb9fPxob5JvNCGwxrjt10Ob+CnLQ2ueuK9wgUah9pgL4a//kqIoo8DmLEXg/6mFHhst+obSJac2z5tW+P6PLgfJin23NJMTq6GzwW5hN7FbXNSODS/d7Fz3uv2Y2ijMolxJL6/xb/SLufDZ+VrXbImPszlVcen1oesO2fXjYkYPdvTav6785xrhhY0Hmq6ROS8jv4h4efCbFc26EGG18LqXKqeNldDGp4Q6eTU65mZX4UTPGhhXslgosqrfr8g3Z7l1+ohT4eSpnP+lY6+FFL3vYKLJ3CPen1zfe2RYZti675BmNM/ntKRMhGO+jbTHzV/0/r+P9MOje/ys8YUmuhuaAJjhXM6iyZ1t+OxPl/ZpMecQUxJwzdTTDR4K9zvCxtQHqRIYDY/nLFPPd0lG0+eb/0OORoE0Y+/+flg4btt9DDHOv07YT5GYxyVoCA3j27ql8L3br5/7ku8h7s9dpO6y/XiktD5kWGDxQ2BHeQFMCue391j4GoAguO02Pt8xxWBj23jX1vVHV7gOSMqSJgDju19NBs0IZKPY2Q07IWueIbtCsZ1ID//vIznYLcLG3jEeka/xbYR6CidPjYHtCez3EadxF6g7973ZLjUSRydC2U1m/m5UksOha19sjm90YC7kkhSJ34Rtf9EyYK2t6P3ek2lb57r1Qiu157mi4+uL8/FTd9dpc3ieL3T3cWO3Bed4YQRORbLWwEPwP3vt6+YY3/f2taFpRje83772VtLL42tItpr4Imzr5sQ3wl8NmT79ZlNBx8fYce2pm/NKQ2w+R5+curvz5bq58n9VW9fvE8yhdtdZR/9a6bexsfk2bfq3U4a/cx++i9nwlTQyME/m1UAzAlkTvqWZQdiFsUbCdQF5DvchodxOKFdGytSedt5Eym1DxxkpG9X4Eo4t2Y4PA207e8fI2s6tJ4/vfPMI5DpQt0+jrxHR1IUym0j+2tNG76gA/lFKeQ7BV2BF0IxAFnwlzQz856hGwiS5p/yWEhH6oQrk3QxtZ6D8zzoGlCsiZU4RfLWwv7vEsptQ2yBfd1tKb1t2eSH/JpK/FsrwtpiALYVyD+cQfNdYETQjWL7GVyaWf3TKZXlBQL5YfU91SeMoKAPIc6uLEXyefY0y94sRAgbA3NPu/OoBYW3RZRPZR51bplfWbVvFBsxNoEzSxHIOdl5nT4qEtII5+jkYCNtD7RPzls7vrFVTux+3L44eAFbQuMPZITaPWzqDxUAGUsi4scLEnVy3vac/OZu7udSpaGIr1D32zu/idaTAVDcdd2xJeTzRsi/OMfgubJvy4snhz5RMMPNqhbP5G+XT0Mtjl/qhFLYltbOPNZfgxYHzhkD3Uzq/9yMuHtyMVPeOjl0t+WG1p2nIWfQ7uq9Y8HUrNRKT3HT8RG8vNH5CpF5on9oySfMZK6cRtr2hZZAqvAphGy90UCZF5DcjXZ97GsYQ4Tw5kBdovtB4uPUPsiKwL/NqSLD/nIic83WkMLHg+x4oUNBEsCCzN0NM+F2K0GP2wjZeBb9egGtQ6v4LYVtJpyMZ9R6NSE7op4aWiTTqamgEIM9JNjSchl6e/6U8tI+IzfG9pQmxAo09I/bC37zt3QUJPbIeGu6N29kkrYWlzEkqw/jVp5N+whrfPvA/r9bcTOkyZScod3YFqCDT8T8uOHQSTwG4cyVsiPlA66ARto0xEd8I246ukYVox2My5YKXVHdBw3Hb1dBCYcHXkPzilA6eoJx8/sNerIucZ5mZHR0LPjY5YD/DNQg/6WaaKrpMI2zjOas95VPSMmmEbaMMIe2iTkPH3jLZ4DnqTp+/aaG8ShA4kw53lZdYAfGH8Nc9Rnr3yVj1eNgL225pGqTrtqRhxN4yeBbs/dk4m28xXhRttw/fDqxbOsdPtFBe2c+QCQBrGyUpc8LzmtJcX3Wq0LLlK0z0Xl2PnWa2mUjKzeex93ufe+PCH/x1KbgPQj6+sea+x6pbjBpOC6UTfLtIvqme2IqAFR6SY35BJwg/PDvzFzax8Lun8XFvJvYEyY2pWCW2TTKcTd6X7ZMp+iCFIjHfTtiWHWNP2m6DxzYn1u0Gl2AWFzxXBOFQUQeMp1oriSDsRP+IdH/UUNDKA47DKUkuayVlANmVLCpgbFv7ZSuE/UyvPceVsi+fEzszhcvaNrdMr6zoVpewT+6fR9unRcaxROu2ZaVQVoeEdrlsIvlrJ/+WEkEo5BhMxNUQW1JmB2HhxzzCXLg3Tjm+qXma4iPCLyW/EfY5huDzxcerIVzkCAvnh8i+fNdunbEvd79TCL7S08ay1y5xagnPUYgl7nH88Orqqp19FZ627Tx1f4QcBJTrrjxlokNlocwmkr928m8pEUQEn+/J2RGV4msA5qYetHJ1LhAXfkM4+PoBIwg+W88m0obuZdx1JE90tIF4H4X2VWOCQKRCmdg91rH1lA9pqN1xVPCHuWeqQNtCQWMPCXV72y7sz2UTyV8P2Y8tGz63iF88q38PKJ4jh/BnQSsB8Ys+hwrh4eMogs/W1b2bYgishSRPsWDYA6KG0U5dQTa64Ov1R4xtoDyfm6FRrb3D3V79DwPrZmGYvCgilN9E8tdO/i2l7ysq+FKeSGOtJs0O5PmIc01sDwLmhqswjBoJoXwwouDr1bfLaCffoIMW1GCEWJ24n8+wggAzCb5e2TrQrqi9ZkIdffie3lIiMMK5QjqPyFQihDo2kfy1k39L6fs6EnxXUiYKr3LxiuPvq1ix6WFPDL+z1+f7+CEjzM3ZscfDwoG9OnjIKh1XZwPGTu1PqWGlIBujnvwqQTy/qrALCV706yfjN57czsi+SjL980bYDzviP/SPx7atny/4TmkhP+W0u9cX3M+dH/Lftn1PqX0dOM7OPvdLTn1O3Te2brblvabj10tyP+4G1l06m4LXl5C/SZVB0rmVMoUmUf+RmFjRKi/SholZwTKXiD3OLukqvKLkAHn1ySX5DVjnBPFJ246SFEW5bJA2yblo4Zch9B5IURQFaUPeTvgVtDAyhF69ZOGtKMrMwMwVpdgd1UsSfkg3/fglbBMVRRkZpM33dULk7KYuMCYrKcKaUR9kRVFkEHdn6/N4Di0KRsurMtq5WntERVFmAvlW8Y9zCECEfTx9bElRFCUF5Gl+kwpAxB3wfaimpyhKHjDuLLnChuEVVhacgwMEwLgj3WOYyxa3uSRFUS6eKxoAXga0HELn8tK5KUmuQZ2LTOeKU9Lwl6w0ZN7Y1pCiKMpQYObWhkZymBNuo9rpKYoyHjgOdrgUaujQVlGUKYFZ9a1xfn6G4IFqeYqizAGMLd25BKAKPEVRzgtOC5iZQwWzWqwCT1GUZQCjBY4pBA8q7BRFOYVB5iynALPgwLZ8BRlTlc5spXCyNvazM3nh33sykVezI74qiqJ0/B/i6mPM7aAnHgAAAABJRU5ErkJggg=="
          alt="Creditcoin"
          style={{ width: 106, height: 24 }}
        />
      </LogoWrapper>

      {pageConfig.categories.map(
        ({ id: categoryId, key: categoryKey }: PageCategory) => (
          <React.Fragment key={`sidemenu_category_${categoryId}`}>
            {/* display heading if not `default` (used for top links) */}
            {categoryKey !== 'default' && (
              <Heading title={t(categoryKey)} minimised={sideMenuMinimised} />
            )}

            {/* display category links */}
            {pagesToDisplay.map(
              ({ category, hash, key, icon, action }: PageItem) => (
                <React.Fragment key={`sidemenu_page_${categoryId}_${key}`}>
                  {category === categoryId && (
                    <Primary
                      name={t(key)}
                      to={hash}
                      active={hash === pathname}
                      icon={icon}
                      action={action}
                      minimised={sideMenuMinimised}
                    />
                  )}
                </React.Fragment>
              )
            )}
          </React.Fragment>
        )
      )}
    </>
  );
};
