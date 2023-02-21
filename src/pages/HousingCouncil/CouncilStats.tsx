import { useCouncil } from 'contexts/Council';
import StatBoxList from 'library/StatBoxList';
import { Text } from 'library/StatBoxList/Text';

import { useTranslation } from 'react-i18next';

export const CouncilStats = () => {
  const { t } = useTranslation('pages');
  const { members, totalProposals, proposals } = useCouncil();

  return (
    <StatBoxList>
      <Text label={t('council.totalProposals')} value={`${totalProposals}`} />
      <Text
        label={t('council.activeProposals')}
        value={`${proposals.length}`}
      />
      <Text label={t('council.membersCount')} value={`${members.length}`} />
    </StatBoxList>
  );
};
