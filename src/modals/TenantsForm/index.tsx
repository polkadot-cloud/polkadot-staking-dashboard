import { faArrowUp, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
import { Asset } from 'contexts/Assets/types';
import { useModal } from 'contexts/Modal';
import { useNotifications } from 'contexts/Notifications';
import { InputWrapper } from 'library/Form/Wrappers';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { ContentWrapper } from 'library/Overlay/Wrappers';
import { FooterWrapper, PaddingWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyApi, AnyJson } from 'types';

interface TenantsFormProps {
  asset: Asset;
}

export const TenantsForm = () => {
  const { t } = useTranslation('pages');

  const { address } = useAccount();
  const { api } = useApi();
  const { config, setStatus } = useModal();
  const { notifySuccess, notifyError } = useNotifications();

  const [formData, setFormData] = useState<AnyJson>({
    additional: [],
    pgpFingerprint: null,
    image: { none: null },
  });
  const [pending, setPending] = useState(false);
  const [tx, setTx] = useState<AnyApi>(null);

  const { asset } = config as TenantsFormProps;

  const fields = [
    {
      key: 'display',
      label: 'Display',
    },
    {
      key: 'legal',
      label: 'Legal',
    },
    {
      key: 'web',
      label: 'Website',
    },
    {
      key: 'riot',
      label: 'Riot',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'twitter',
      label: 'Twitter',
    },
  ];

  const { submitTx } = useSubmitExtrinsic({
    tx,
    from: address as string,
    shouldSubmit: true,
    callbackInBlock: () => {},
    callbackSubmit: () => {},
    callbackSuccess: () => {
      setPending(false);
      notifySuccess(t('tenants.applicationSuccess'));
      setStatus(2);
    },
    callbackError: () => {
      notifyError(t('tenants.applicationFailure'));
      setPending(false);
    },
  });

  useEffect(() => {
    if (tx) {
      setPending(true);
      submitTx();
    }
  }, [tx]);

  return (
    <>
      <Title title={t('tenants.formTitle')} />
      <PaddingWrapper>
        <ContentWrapper>
          {fields.map(({ key, label }) => (
            <InputWrapper>
              <div className="inner">
                <section>
                  <h3>{label}:</h3>
                  <div className="input">
                    <div>
                      <input
                        type="text"
                        value={formData[key]?.raw || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [key]: { raw: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </section>
              </div>
            </InputWrapper>
          ))}
          <FooterWrapper>
            <ButtonSubmit
              text={t('tenants.submit')}
              disabled={pending}
              iconLeft={pending ? faSpinner : faArrowUp}
              iconTransform="grow-2"
              onClick={() => {
                setTx(
                  api
                    ? api.tx.tenancyModule.requestAsset(
                        formData,
                        asset.collId,
                        asset.itemId
                      )
                    : null
                );
              }}
            />
          </FooterWrapper>
        </ContentWrapper>
      </PaddingWrapper>
    </>
  );
};
