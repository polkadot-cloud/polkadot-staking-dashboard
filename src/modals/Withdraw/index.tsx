import {
  faArrowAltCircleDown,
  faMinus,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonInvert, ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
import { useInvest } from 'contexts/Invest';
import { useModal } from 'contexts/Modal';
import { useNetworkMetrics } from 'contexts/Network';
import { useNotifications } from 'contexts/Notifications';
import { Warning } from 'library/Form/Warning';
import { InputWrapper, Spacer } from 'library/Form/Wrappers';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { FooterWrapper, PaddingWrapper } from 'modals/Wrappers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { humanNumberBn, planckBnToUnit, unitToPlanckBn } from 'Utils';

export const WithdrawFund = () => {
  const { t } = useTranslation('pages');
  const { address } = useAccount();
  const { availableBalance } = useInvest();
  const { api } = useApi();
  const { setStatus } = useModal();
  const { decimals } = useNetworkMetrics();
  const { notifyError, notifySuccess } = useNotifications();

  const [amount, setAmount] = useState(0);
  const [pending, setPending] = useState(false);

  const getTx = () => {
    if (!api) return null;
    return api.tx.housingFundModule.withdrawFund(
      unitToPlanckBn(amount.toString(), decimals)
    );
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: address as string,
    shouldSubmit: true,
    callbackInBlock: () => {},
    callbackSubmit: () => {},
    callbackSuccess: () => {
      setPending(false);
      notifySuccess(t('investors.depositSuccess'));
      setStatus(2);
    },
    callbackError: () => {
      notifyError(t('investors.depositFailed'));
      setPending(false);
    },
  });

  const onMaxBalance = () => {
    setAmount(planckBnToUnit(availableBalance, decimals));
  };

  return (
    <>
      <Title title={t('investors.withdraw')} icon={faMinus} />
      <PaddingWrapper>
        {availableBalance.isZero() && (
          <Warning text={t('investors.noFundToWithdraw')} />
        )}
        <Spacer />
        <InputWrapper>
          <h3>{t('investors.withdraw')}</h3>
          <div className="inner">
            <section style={{ opacity: 1 }}>
              <div className="input">
                <div>
                  <input
                    type="text"
                    placeholder="0 FST"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <p>{`${humanNumberBn(
                    availableBalance,
                    decimals
                  )} available`}</p>
                </div>
              </div>
            </section>
            <section>
              <ButtonInvert text={t('max')} onClick={onMaxBalance} />
            </section>
          </div>
        </InputWrapper>
        <FooterWrapper>
          <ButtonSubmit
            text={t('investors.withdraw')}
            disabled={pending || submitting}
            iconLeft={pending || submitting ? faSpinner : faArrowAltCircleDown}
            iconTransform="grow-2"
            onClick={() => {
              submitTx();
            }}
          />
        </FooterWrapper>
      </PaddingWrapper>
    </>
  );
};
