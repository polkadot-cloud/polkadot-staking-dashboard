import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { SectionFullWidthThreshold, SideMenuStickyThreshold } from 'consts';
import { useAccount } from 'contexts/Account';
import { useModal } from 'contexts/Modal';
import { Warning } from 'library/Form/Warning';
import { InvestGraph } from 'library/Graphs/Invest';
import { CardHeaderWrapper, CardWrapper } from 'library/Graphs/Wrappers';
import { useTranslation } from 'react-i18next';
import {
  ButtonRowWrapper,
  PageRowWrapper,
  RowSecondaryWrapper,
} from 'Wrappers';
import { InvestStats } from './Stats';

export const ManageFund = () => {
  const { t } = useTranslation('pages');
  const { openModalWith } = useModal();
  const { isInvestor } = useAccount();

  const onWithdraw = () => {
    openModalWith('WithdrawFund', {});
  };
  const onDeposit = () => {
    openModalWith('DepositFund', {});
  };

  return (
    <>
      {!isInvestor() && (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
          <Warning text="You need the INVESTOR role to withdraw/deposit funds" />
        </PageRowWrapper>
      )}

      <InvestStats />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <RowSecondaryWrapper
          hOrder={0}
          vOrder={0}
          thresholdStickyMenu={SideMenuStickyThreshold}
          thresholdFullWidth={SectionFullWidthThreshold}
        >
          <CardWrapper>
            <CardHeaderWrapper>
              <h3>{t('investors.balanceDistribution')}</h3>
            </CardHeaderWrapper>
            <ButtonRowWrapper>
              <ButtonPrimary
                text={t('investors.deposit')}
                iconLeft={faPlus}
                onClick={onDeposit}
                marginRight
                disabled={!isInvestor()}
              />
              <ButtonPrimary
                text={t('investors.withdraw')}
                iconLeft={faMinus}
                onClick={onWithdraw}
                disabled={!isInvestor()}
              />
            </ButtonRowWrapper>
            <InvestGraph />
          </CardWrapper>
        </RowSecondaryWrapper>
      </PageRowWrapper>
    </>
  );
};
