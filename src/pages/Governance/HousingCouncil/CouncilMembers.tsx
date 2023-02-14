import { useCouncil } from 'contexts/Council';
import Identicon from 'library/Identicon';
import { Header } from 'library/List';
import { useTranslation } from 'react-i18next';
import { clipAddress } from 'Utils';
import {
  AddressWrapper,
  CouncilListWrapper,
  CouncilorWrapper,
  ListWrapper,
  RowWrapper,
} from './Wrappers';

export const CouncilMembers = () => {
  const { members } = useCouncil();
  const { t } = useTranslation('pages');
  return (
    <>
      <ListWrapper>
        <Header>
          <h4>{t('council.members')}</h4>
        </Header>
        <CouncilListWrapper>
          {members.map((member, index) => (
            <CouncilorWrapper key={index}>
              <RowWrapper>
                <Identicon value={member} size={28} />
                <AddressWrapper>{clipAddress(member)}</AddressWrapper>
              </RowWrapper>
            </CouncilorWrapper>
          ))}
        </CouncilListWrapper>
      </ListWrapper>
    </>
  );
};
