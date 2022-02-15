import { useEffect, useState } from 'react';
import { PageProps } from './types';
import { StatBoxList } from '../library/StatBoxList';
import { useApi } from '../contexts/Api';
import BN from "bn.js";
import { numCommaFormatted } from '../Utils';

const LAST_ERA = 622;

export const Overview = (props: PageProps) => {

  const { api, isReady }: any = useApi();

  const [totalNominators, setTotalNominators]: any = useState(null);
  const [lastReward, setLastReward]: any = useState(null);
  const [lastTotalStake, setLastTotalStake]: any = useState(null);

  const subscribeToStakingOverview = async () => {

    if (isReady()) {

      const unsub = await api.queryMulti([
        api.query.staking.counterForNominators,
        [api.query.staking.erasValidatorReward, LAST_ERA],
        [api.query.staking.erasTotalStake, LAST_ERA],
      ], ([_totalNominators, _lastReward, _lastTotalStake]: any) => {

        // format lastReward
        _lastReward = _lastReward.unwrapOrDefault(null);
        _lastReward = _lastReward === null
          ? null
          : numCommaFormatted(new BN(_lastReward.toNumber() / (10 ** 10)));

        _lastTotalStake = numCommaFormatted(new BN(_lastTotalStake / (10 ** 10)).toNumber());

        setTotalNominators(_totalNominators.toHuman());
        setLastReward(_lastReward + " DOT");
        setLastTotalStake(_lastTotalStake + " DOT");
      });

      return unsub;
      // const points = await api.query.staking.erasValidatorReward(622);
      // console.log(numCommaFormatted(rewardPrevious.toNumber()));
    }
  }

  useEffect(() => {
    let unsub: any = subscribeToStakingOverview();

    return (() => {
      unsub();
    })
  }, [isReady()]);

  const items = [
    {
      label: "Total Nominators",
      value: totalNominators,
    },
    {
      label: "Total Staked",
      value: lastTotalStake,
    },
    {
      label: "Last Reward Payout",
      value: lastReward,
    },
  ];

  return (
    <>
      <StatBoxList title="What's Happening" items={items} />
    </>
  );
}

export default Overview;