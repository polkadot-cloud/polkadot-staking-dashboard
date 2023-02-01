import {
  faArrowAltCircleUp,
  faPlus,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonInvert, ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
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

export const DepositFund = () => {
  const { t } = useTranslation('pages');
  const { api } = useApi();
  const { setStatus } = useModal();
  const { metrics } = useNetworkMetrics();
  const { notifyError, notifySuccess } = useNotifications();

  const [amount, setAmount] = useState(0);
  const { balance, address } = useAccount();
  const [pending, setPending] = useState(false);

  const getTx = () => {
    if (!api) return null;
    return api.tx.housingFundModule.contributeToFund(
      unitToPlanckBn(amount.toString(), metrics.decimals)
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
    setAmount(planckBnToUnit(balance, metrics.decimals));
  };

  return (
    <>
      <Title title={t('investors.deposit')} icon={faPlus} />
      <PaddingWrapper>
        {balance.isZero() && <Warning text={t('investors.noFundToDeposit')} />}
        <Warning text={t('investors.depositWarning')} />
        <Spacer />
        <InputWrapper>
          <h3>{t('investors.deposit')}</h3>
          <div className="inner">
            <section style={{ opacity: 1 }}>
              <div className="input">
                <div>
                  <input
                    type="text"
                    placeholder="0 FST"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <p>{`${humanNumberBn(
                    balance,
                    metrics.decimals
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
            text={t('investors.deposit')}
            disabled={pending || submitting}
            iconLeft={pending || submitting ? faSpinner : faArrowAltCircleUp}
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
