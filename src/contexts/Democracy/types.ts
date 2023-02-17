export interface DemocracyOngoing {
  end: number;
  proposalHash: string;
  threshold: string;
  delay: number;
  tally: {
    ayes: number;
    nays: number;
    turnout: number;
  };
}

export interface DemocracyFinished {
  approved: boolean;
  end: number;
}

export interface DemocracyVotes {
  ongoing?: DemocracyOngoing;
  finished?: DemocracyFinished;
}

export interface DemocracyContextInterface {
  fetchDemocracyVotes: (index: number) => Promise<DemocracyVotes>;
}
