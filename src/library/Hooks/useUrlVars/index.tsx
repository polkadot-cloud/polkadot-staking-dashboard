// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NETWORKS } from 'config/networks';
import { useApi } from 'contexts/Api';
import { availableLanguages } from 'locale';
import { changeLanguage } from 'locale/utils';
import { useTranslation } from 'react-i18next';
import { NetworkName } from 'types';
import { extractUrlValue, isNetworkFromMetaTags } from 'Utils';

export const useUrlVars = () => {
  const { i18n } = useTranslation();
  const { network, switchNetwork, updateIconMetaTags } = useApi();

  const initialise = () => {
    // get url variables
    const networkFromUrl = extractUrlValue('n');
    const lngFromUrl = extractUrlValue('l');

    // is the url-provided network valid or not.
    const urlNetworkValid = !!Object.values(NETWORKS).find(
      (n: any) => n.name.toLowerCase() === networkFromUrl
    );

    const urlIsDifferentNetwork =
      urlNetworkValid && networkFromUrl !== network.name;

    // if valid network differs from currently active network, switch to network.
    if (urlNetworkValid && urlIsDifferentNetwork) {
      switchNetwork(networkFromUrl as NetworkName, true);
    }

    // check if favicons are up to date.
    const isValid = isNetworkFromMetaTags(network.name as NetworkName);

    // this only needs to happen when `n` is in URL and a change needs to take place.
    if (!isValid || urlIsDifferentNetwork) {
      updateIconMetaTags(network.name as NetworkName);
    }

    if (availableLanguages.find((n: any) => n[0] === lngFromUrl)) {
      changeLanguage(lngFromUrl as string, i18n);
    }
  };
  return { initialise };
};
