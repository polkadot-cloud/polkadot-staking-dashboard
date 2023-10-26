import { useApi } from 'contexts/Api';
import { Title } from 'library/Prompt/Title';
import { useTranslation } from 'react-i18next';
import { PromptSelectItem } from 'library/Prompt/Wrappers';
import { useNetwork } from 'contexts/Network';
import { NetworkList } from 'config/networks';
import { usePrompt } from 'contexts/Prompt';

export const ProvidersPrompt = () => {
  const { t } = useTranslation('modals');
  const { network } = useNetwork();
  const { closePrompt } = usePrompt();
  const { rpcEndpoint, setRpcEndpoint } = useApi();

  const rpcProviders = NetworkList[network].endpoints.rpcEndpoints;
  return (
    <>
      <Title title="RPC Providers" closeText={t('cancel')} />
      <div className="padded">
        <h4 className="subheading">
          Select an RPC provider to change the node Staking Dashboard connects
          to.
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
                {key} {isDisabled && `  [Active]`}
              </h3>
              <h4>{url}</h4>
            </PromptSelectItem>
          );
        })}
      </div>
    </>
  );
};
