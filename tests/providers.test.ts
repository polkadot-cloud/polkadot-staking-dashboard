/* Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
 * SPDX-License-Identifier: Apache-2.0 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { TooltipProvider } from 'contexts/Tooltip';
import { AccountProvider } from 'contexts/Account';
import { APIProvider, useApi } from 'contexts/Api';
import { BalancesProvider } from 'contexts/Balances';
import { ConnectProvider } from 'contexts/Connect';
import { ExtensionsProvider } from 'contexts/Extensions';
import { ExtrinsicsProvider } from 'contexts/Extrinsics';
import { FastUnstakeProvider } from 'contexts/FastUnstake';
import { FiltersProvider } from 'contexts/Filters';
import { HelpProvider } from 'contexts/Help';
import { MenuProvider } from 'contexts/Menu';
import { ModalProvider } from 'contexts/Modal';
import { NetworkMetricsProvider } from 'contexts/Network';
import { NotificationsProvider } from 'contexts/Notifications';
import { OverlayProvider } from 'contexts/Overlay';
import { PluginsProvider } from 'contexts/Plugins';
import { ActivePoolsProvider } from 'contexts/Pools/ActivePools';
import { BondedPoolsProvider } from 'contexts/Pools/BondedPools';
import { PoolMembersProvider } from 'contexts/Pools/PoolMembers';
import { PoolMembershipsProvider } from 'contexts/Pools/PoolMemberships';
import { PoolsConfigProvider } from 'contexts/Pools/PoolsConfig';
import { SetupProvider } from 'contexts/Setup';
import { StakingProvider } from 'contexts/Staking';
import { SubscanProvider } from 'contexts/Subscan';
import { useTheme } from 'contexts/Themes';
import { TransferOptionsProvider } from 'contexts/TransferOptions';
import { TxFeesProvider } from 'contexts/TxFees';
import { UIProvider } from 'contexts/UI';
import { ValidatorsProvider } from 'contexts/Validators';
import { withProviders } from 'library/Hooks';

export const Providers = ({ children }: { children: any }) => {
    const Inner = (children: any) => {
        return (
            { children }
        )
    }
    return withProviders(
        FiltersProvider,
        APIProvider,
        ExtensionsProvider,
        ConnectProvider,
        HelpProvider,
        NetworkMetricsProvider,
        AccountProvider,
        BalancesProvider,
        StakingProvider,
        PoolsConfigProvider,
        BondedPoolsProvider,
        PoolMembershipsProvider,
        PoolMembersProvider,
        ActivePoolsProvider,
        TransferOptionsProvider,
        ValidatorsProvider,
        FastUnstakeProvider,
        UIProvider,
        PluginsProvider,
        SetupProvider,
        SubscanProvider,
        MenuProvider,
        TooltipProvider,
        NotificationsProvider,
        TxFeesProvider,
        ExtrinsicsProvider,
        ModalProvider,
        OverlayProvider
    )(Inner)
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: Providers, ...options });
test("providers work", () => { });