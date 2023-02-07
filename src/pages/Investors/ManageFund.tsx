import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useModal } from 'contexts/Modal';
import { InvestGraph } from 'library/Graphs/Invest';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { useTranslation } from 'react-i18next';
import { ButtonRowWrapper } from 'Wrappers';

export const ManageFund = () => {
  const { t } = useTranslation('pages');
  const { openModalWith } = useModal();

  const onWithdraw = () => {
    openModalWith('WithdrawFund', {});
  };
  const onDeposit = () => {
    openModalWith('DepositFund', {});
  };

  return (
    <>
      <CardHeaderWrapper>
        <h3>{t('investors.balanceDistribution')}</h3>
      </CardHeaderWrapper>
      <ButtonRowWrapper>
        <ButtonPrimary
          text={t('investors.deposit')}
          iconLeft={faPlus}
          onClick={onDeposit}
          marginRight
        />
        <ButtonPrimary
          text={t('investors.withdraw')}
          iconLeft={faMinus}
          onClick={onWithdraw}
        />
      </ButtonRowWrapper>
      <InvestGraph />
    </>
  );
};
