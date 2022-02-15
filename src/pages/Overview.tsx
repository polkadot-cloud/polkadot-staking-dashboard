import { useEffect, useState } from 'react';
import { PageProps } from './types';
import { StatBoxList } from '../library/StatBoxList';
import { useApi } from '../contexts/Api';
import BN from "bn.js";

const LAST_ERA = 622;

export const Overview = (props: PageProps) => {

  const { api, isReady }: any = useApi();

  // TO DO: Move to network context.
  const [totalNominators, setTotalNominators]: any = useState(0);
  const [lastReward, setLastReward]: any = useState(0);
  const [lastTotalStake, setLastTotalStake]: any = useState(0);

  const subscribeToStakingOverview = async () => {

    if (isReady()) {

      const unsub = await api.queryMulti([
        api.query.staking.counterForNominators,
        [api.query.staking.erasValidatorReward, LAST_ERA],
        [api.query.staking.erasTotalStake, LAST_ERA],
      ], ([_totalNominators, _lastReward, _lastTotalStake]: any) => {

        // format lastReward
        _lastReward = _lastReward.unwrapOrDefault(0);
        _lastReward = _lastReward === 0
          ? 0
          : new BN(_lastReward.toNumber() / (10 ** 10));

        _lastTotalStake = new BN(_lastTotalStake / (10 ** 10)).toNumber();

        setTotalNominators(_totalNominators.toNumber());
        setLastReward(_lastReward);
        setLastTotalStake(_lastTotalStake);
      });

      return unsub;
      // const points = await api.query.staking.erasValidatorReward(622);
      // console.log(numCommaFormatted(rewardPrevious.toNumber()));
    }
  }

  useEffect(() => {
    let unsub: any = subscribeToStakingOverview();
  }, [isReady()]);

  const items = [
    {
      label: "Total Nominators",
      value: totalNominators,
      unit: "",
    },
    {
      label: "Total Staked",
      value: lastTotalStake,
      unit: "DOT",
    },
    {
      label: "Last Reward Payout",
      value: lastReward,
      unit: "DOT",
    },
  ];

  return (
    <>
      <StatBoxList title="What's Happening" items={items} />
    </>
  );
}

export default Overview;