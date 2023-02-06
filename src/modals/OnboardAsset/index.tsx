import { faArrowUp, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useNetworkMetrics } from 'contexts/Network';
import { useNotifications } from 'contexts/Notifications';
import { InputWrapper } from 'library/Form/Wrappers';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { FooterWrapper, PaddingWrapper } from 'modals/Wrappers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { unitToPlanckBn } from 'Utils';

export const OnboardAsset = () => {
  const { t } = useTranslation('pages');
  const { api } = useApi();
  const { address } = useAccount();
  const { setStatus } = useModal();
  const { metrics } = useNetworkMetrics();
  const { notifyError, notifySuccess } = useNotifications();

  const [price, setPrice] = useState(0);
  const [metadata, setMetadata] = useState<string>('');
  const [pending, setPending] = useState(false);

  const getTx = () => {
    if (!api) return null;
    return api.tx.onboardingModule.createAndSubmitProposal(
      'HOUSES',
      unitToPlanckBn(price.toString(), metrics.decimals),
      metadata,
      true
    );
  };
  const { submitTx } = useSubmitExtrinsic({
    tx: getTx(),
    from: address as string,
    shouldSubmit: true,
    callbackInBlock: () => {},
    callbackSubmit: () => {},
    callbackSuccess: () => {
      setPending(false);
      notifySuccess(t('sellers.onboardingSuccess'));
      setStatus(2);
    },
    callbackError: () => {
      notifyError(t('sellers.onboardingFailed'));
      setPending(false);
    },
  });

  return (
    <>
      <Title title={t('sellers.onboardAsset')} />
      <PaddingWrapper>
        <InputWrapper>
          <div className="inner">
            <section>
              <h3>{t('sellers.price')}:</h3>
              <div className="input">
                <div>
                  <input
                    type="number"
                    placeholder={t('sellers.phAssetPrice') as string}
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
              </div>
            </section>
          </div>
        </InputWrapper>
        <InputWrapper>
          <div className="inner">
            <section>
              <h3>{t('sellers.metadata')}:</h3>
              <div className="input">
                <div>
                  <input
                    type="text"
                    placeholder={t('sellers.phMetadata') as string}
                    value={metadata}
                    onChange={(e) => setMetadata(e.target.value)}
                  />
                </div>
              </div>
            </section>
          </div>
        </InputWrapper>
        <FooterWrapper>
          <ButtonSubmit
            text={t('sellers.submit')}
            disabled={pending}
            iconLeft={pending ? faSpinner : faArrowUp}
            iconTransform="grow-2"
            onClick={() => {
              setPending(true);
              submitTx();
            }}
          />
        </FooterWrapper>
      </PaddingWrapper>
    </>
  );
};
