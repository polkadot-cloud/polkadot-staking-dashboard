import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
import { useAssets } from 'contexts/Assets';
import { useNotifications } from 'contexts/Notifications';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { HouseList } from 'library/HouseList';
import PageTitle from 'library/PageTitle';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyApi } from 'types';
import { PageRowWrapper, Separator } from 'Wrappers';

export const NotaryView = () => {
  const { address } = useAccount();
  const { t } = useTranslation('pages');
  const { assets, fetchAssets } = useAssets();
  const { isNotary } = useAccount();
  const { isReady, api } = useApi();
  const { notifyError, notifySuccess } = useNotifications();
  const assetsFinalising = assets.filter(
    (asset) => asset.status === 'FINALISING'
  );

  const [tx, setTx] = useState<AnyApi>(null);

  const menuItems = isNotary()
    ? [
        {
          icon: <FontAwesomeIcon icon={faThumbsUp} color="green" />,
          title: 'Approve',
          cb: (collId: number, itemId: number) => {
            setTx(
              api && isReady
                ? api.tx.finalizerModule.validateTransactionAsset(
                    collId,
                    itemId
                  )
                : null
            );
          },
        },
        {
          icon: <FontAwesomeIcon icon={faThumbsDown} color="red" />,
          title: 'Reject',
          cb: (collId: number, itemId: number) => {
            setTx(
              api && isReady
                ? api.tx.finalizerModule.rejectTransactionAsset(collId, itemId)
                : null
            );
          },
        },
      ]
    : [];

  const { submitTx } = useSubmitExtrinsic({
    tx,
    from: address as string,
    shouldSubmit: true,
    callbackInBlock: () => {},
    callbackSubmit: () => {},
    callbackSuccess: () => {
      notifySuccess(t('notary.success'));
      fetchAssets();
    },
    callbackError: () => {
      notifyError(t('notary.failure'));
    },
  });

  useEffect(() => {
    if (tx) submitTx();
  }, [tx]);

  return (
    <>
      <PageTitle title={t('notary.pageTitle')} />
      <Separator />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <HouseList
            assets={assetsFinalising}
            title={`${assetsFinalising.length} assets available`}
            menuItems={menuItems}
          />
        </CardWrapper>
      </PageRowWrapper>
    </>
  );
};
