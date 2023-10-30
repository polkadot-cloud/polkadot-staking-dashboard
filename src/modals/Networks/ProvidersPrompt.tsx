import { useApi } from 'contexts/Api';
import { Title } from 'library/Prompt/Title';
import { useTranslation } from 'react-i18next';
import { PromptSelectItem } from 'library/Prompt/Wrappers';
import { useNetwork } from 'contexts/Network';
import { NetworkList } from 'config/networks';
import { usePrompt } from 'contexts/Prompt';
import { capitalizeFirstLetter } from '@polkadot-cloud/utils';

export const ProvidersPrompt = () => {
  const { t } = useTranslation();
  const { network } = useNetwork();
  const { closePrompt } = usePrompt();
  const { rpcEndpoint, setRpcEndpoint } = useApi();

  const rpcProviders = NetworkList[network].endpoints.rpcEndpoints;
  return (
    <>
      <Title
        title={t('rpcProviders', { ns: 'modals' })}
        closeText={t('cancel', { ns: 'modals' })}
      />
      <div className="padded">
        <h4 className="subheading">
          {t('selectRpcProvider', {
            ns: 'modals',
            network: capitalizeFirstLetter(network),
          })}
        </h4>
        {Object.entries(rpcProviders)?.map(([key, url], i) => {
          const isDisabled = rpcEndpoint === key;

          return (
            <PromptSelectItem
              key={`favorite_${i}`}
              className={isDisabled ? 'inactive' : undefined}
              onClick={() => {
                closePrompt();
                setRpcEndpoint(key);
              }}
            >
              <h3>
                {key} {isDisabled && `  (${t('selected', { ns: 'modals' })})`}
              </h3>
              <h4>{url}</h4>
            </PromptSelectItem>
          );
        })}
      </div>
    </>
  );
};
