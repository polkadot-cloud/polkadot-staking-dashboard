import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
import { Asset } from 'contexts/Assets/types';
import { useDemocracy } from 'contexts/Democracy';
import { DemocracyVotes } from 'contexts/Democracy/types';
import { useNotifications } from 'contexts/Notifications';
import { useVoting } from 'contexts/Voting';
import { AssetProposal } from 'library/AssetProposal';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyApi } from 'types';

interface DemocracyProposalProps {
  asset: Asset;
}

export const DemocracyProposal = ({ asset }: DemocracyProposalProps) => {
  const { address, isInvestor } = useAccount();
  const { api } = useApi();
  const { notifySuccess, notifyError } = useNotifications();
  const { t } = useTranslation('pages');
  const { fetchProposals } = useVoting();

  const { proposalHash: hash } = asset;
  const [pending, setPending] = useState(false);
  const [tx, setTx] = useState<AnyApi>(null);
  const { fetchDemocracyVotes } = useDemocracy();
  const [vote, setVote] = useState<DemocracyVotes>({});
  const [isOver, setOver] = useState(false);

  const initStates = () => {
    setPending(false);
    setOver(false);
  };

  const fetchInfo = async () => {
    initStates();
    const { democracyIndex } = await fetchProposals(hash);
    const democracyVote: DemocracyVotes = await fetchDemocracyVotes(
      democracyIndex
    );
    setVote(democracyVote);
    if (!democracyVote.ongoing) setOver(true);
  };

  const onVote = (_vote: boolean) => {
    if (!api) {
      setTx(null);
    } else {
      setTx(api.tx.votingModule.investorVote(hash, _vote));
    }
  };

  const { submitTx } = useSubmitExtrinsic({
    tx,
    from: address as string,
    shouldSubmit: true,
    callbackInBlock: () => {},
    callbackSubmit: () => {},
    callbackSuccess: () => {
      setPending(false);
      notifySuccess(t('council.voteSuccess'));
      fetchInfo();
    },
    callbackError: () => {
      notifyError(t('council.voteFailed'));
      setPending(false);
    },
  });

  useEffect(() => {
    if (!tx) return;
    setPending(true);
    submitTx();
  }, [tx]);

  useEffect(() => {
    if (api && address) fetchInfo();
  }, [api, address]);

  return !isOver ? (
    <AssetProposal
      asset={asset}
      hash={hash}
      ayes={vote.ongoing?.tally.ayes as number}
      nays={vote.ongoing?.tally.nays as number}
      vote={undefined}
      onVote={onVote}
      canVote={!pending && isInvestor()}
      canClose={false}
    />
  ) : (
    <></>
  );
};
