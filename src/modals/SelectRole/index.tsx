import { ROLES } from 'config/accounts';
import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useNotifications } from 'contexts/Notifications';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { PaddingWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyApi } from 'types';
import { ContentWrapper, RoleButton } from './Wrapper';

export const SelectRole = () => {
  const { t } = useTranslation('modals');

  const { setStatus } = useModal();
  const { api } = useApi();
  const { activeAccount } = useConnect();
  const { address } = useAccount();
  const { notifyError, notifySuccess } = useNotifications();

  const [pending, setPending] = useState(false);
  const [tx, setTx] = useState<AnyApi>(null);

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx,
    from: activeAccount,
    shouldSubmit: true,
    callbackInBlock: () => {},
    callbackSubmit: () => {},
    callbackSuccess: () => {
      setPending(false);
      notifySuccess(t('setRoleSuccess'));
      setStatus(2);
    },
    callbackError: () => {
      notifyError(t('setRoleFailed'));

      setPending(false);
    },
  });

  useEffect(() => {
    if (!tx) return;
    setPending(true);
    submitTx();
  }, [tx]);

  return (
    <>
      <Title title={t('selectRole')} loading={pending} />
      <PaddingWrapper>
        <ContentWrapper>
          <Warning text={t('warningSelectRole')} />
          {ROLES.map((_role, index) => (
            <h3 key={index}>
              <RoleButton
                disabled={pending || submitting}
                onClick={() => {
                  setPending(true);
                  setTx(
                    !api ? null : api.tx.roleModule.setRole(address, _role)
                  );
                }}
              >
                {_role}
              </RoleButton>
            </h3>
          ))}
        </ContentWrapper>
      </PaddingWrapper>
    </>
  );
};
