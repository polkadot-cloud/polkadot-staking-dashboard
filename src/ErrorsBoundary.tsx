// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Assistant from 'library/Assistant';
import Feedback from 'pages/explore/Feedback';
import Projects from 'pages/explore/Projects';
import Favourites from 'pages/Favourites';
import Validators from 'pages/Validators';
import Payouts from 'pages/Payouts';
import Pools from 'pages/Pools';
import Stake from 'pages/Stake';
import Overview from 'pages/Overview';
import ChangeNominations from 'modals/ChangeNominations';
import ChangePoolRoles from 'modals/ChangePoolRoles';
import { ChangePoolState } from 'modals/ChangePoolState';
import ClaimReward from 'modals/ClaimReward';
import ConnectAccounts from 'modals/ConnectAccounts';
import { CreatePool } from 'modals/CreatePool';
import { JoinPool } from 'modals/JoinPool';
import { LeavePool } from 'modals/LeavePool';
import Nominate from 'modals/Nominate';
import NominateFromFavourites from 'modals/NominateFromFavourites';
import NominatePool from 'modals/NominatePool';
import SelectFavourites from 'modals/SelectFavourites';
import Settings from 'modals/Settings';
import { UnlockChunks } from 'modals/UnlockChunks';
import UpdateBond from 'modals/UpdateBond';
import UpdateController from 'modals/UpdateController';
import UpdatePayee from 'modals/UpdatePayee';
import ValidatorMetrics from 'modals/ValidatorMetrics';

export class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <>
          <h2>Opps, something went wrong.</h2>
          {this.state.error && this.state.error.toString()}
          <br />
          {this.state.errorInfo.componentStack}
        </>
      );
    }
    return this.props.children;
  }
}

export const AppErrorBoundary = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Failed to find the root element');
};

export const AssistantErrorBoundary = () => {
  if (!{ Assistant }) throw new Error('Failed to get Assistant');
};

export const FeedbackPageErrorBoundary = () => {
  if (!{ Feedback }) throw new Error('Failed to get the Feedback Page');
};

export const CommunityPageErrorBoundary = () => {
  if (!{ Projects }) throw new Error('Failed to get the Feedback Page');
};

export const FavouritesPageErrorBoundary = () => {
  if (!{ Favourites }) throw new Error('Failed to get the Favourites Page');
};

export const ValidatorsPageErrorBoundary = () => {
  if (!{ Validators }) throw new Error('Failed to get the Validators Page');
};

export const PayoutsPageErrorBoundary = () => {
  if (!{ Payouts }) throw new Error('Failed to get the Payouts Page');
};

export const PoolsPageErrorBoundary = () => {
  if (!{ Pools }) throw new Error('Failed to get the Pools Page');
};

export const StakePageErrorBoundary = () => {
  if (!{ Stake }) throw new Error('Failed to get the Stake Page');
};

export const OverviewPageErrorBoundary = () => {
  if (!{ Overview }) throw new Error('Failed to get the Overview Page');
};

export const ChangeNominationsModalErrorBoundary = () => {
  if (!{ ChangeNominations })
    throw new Error('Failed to get the ChangeNominations Modal');
};
export const ChangePoolRolesModalErrorBoundary = () => {
  if (!{ ChangePoolRoles })
    throw new Error('Failed to get the ChangePoolRoles Modal');
};
export const ChangePoolStateModalErrorBoundary = () => {
  if (!{ ChangePoolState })
    throw new Error('Failed to get the ChangePoolState Modal');
};
export const ClaimRewardModalErrorBoundary = () => {
  if (!{ ClaimReward }) throw new Error('Failed to get the ClaimReward Modal');
};
export const ConnectAccountsModalErrorBoundary = () => {
  if (!{ ConnectAccounts })
    throw new Error('Failed to get the ConnectAccounts Modal');
};
export const CreatePoolModalErrorBoundary = () => {
  if (!{ CreatePool }) throw new Error('Failed to get the CreatePool Modal');
};
export const JoinPoolModalErrorBoundary = () => {
  if (!{ JoinPool }) throw new Error('Failed to get the JoinPool Modal');
};
export const LeavePoolModalErrorBoundary = () => {
  if (!{ LeavePool }) throw new Error('Failed to get the LeavePool Modal');
};
export const NominateModalErrorBoundary = () => {
  if (!{ Nominate }) throw new Error('Failed to get the Nominate Modal');
};
export const NominateFromFavouritesModalErrorBoundary = () => {
  if (!{ NominateFromFavourites })
    throw new Error('Failed to get the NominateFromFavourites Modal');
};
export const NominatePoolModalErrorBoundary = () => {
  if (!{ NominatePool })
    throw new Error('Failed to get the NominatePool Modal');
};
export const SelectFavouritesRolesModalErrorBoundary = () => {
  if (!{ SelectFavourites })
    throw new Error('Failed to get the SelectFavourites Modal');
};
export const SettingsModalErrorBoundary = () => {
  if (!{ Settings }) throw new Error('Failed to get the Settings Modal');
};
export const UnlockChunkModalErrorBoundary = () => {
  if (!{ UnlockChunks })
    throw new Error('Failed to get the UnlockChunks Modal');
};
export const UpdateBondModalErrorBoundary = () => {
  if (!{ UpdateBond }) throw new Error('Failed to get the UpdateBond Modal');
};
export const UpdateControllerModalErrorBoundary = () => {
  if (!{ UpdateController })
    throw new Error('Failed to get the UpdateController Modal');
};
export const UpdatePayeeModalErrorBoundary = () => {
  if (!{ UpdatePayee }) throw new Error('Failed to get the UpdatePayee Modal');
};
export const ValidatorMetricsModalErrorBoundary = () => {
  if (!{ ValidatorMetrics })
    throw new Error('Failed to get the ValidatorMetrics Modal');
};
