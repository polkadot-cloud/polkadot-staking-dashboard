import { ROLES } from 'config/accounts';
import { useAccount } from 'contexts/Account';
import { AccountRole, isRoleValid } from 'contexts/Account/types';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useNotifications } from 'contexts/Notifications';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { PaddingWrapper } from 'modals/Wrappers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentWrapper, RoleButton } from './Wrapper';

export const SelectRole = () => {
  const { t } = useTranslation('modals');

  const { setStatus } = useModal();
  const { api } = useApi();
  const { activeAccount, accountHasSigner } = useConnect();
  const { address, update } = useAccount();
  const { notifyError, notifySuccess } = useNotifications();

  const [role, selectRole] = useState<AccountRole>('');
  const [pending, setPending] = useState(false);

  const getTx = () => {
    if (!api) return null;
    if (!isRoleValid(role)) return null;

    return api.tx.roleModule.setRole(address, role);
  };
  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackInBlock: () => {},
    callbackSubmit: () => {},
    callbackSuccess: () => {
      setPending(false);
      notifySuccess(t('setRoleSuccess'));
      update();
      setStatus(2);
    },
    callbackError: () => {
      notifyError(t('setRoleFailed'));
      setPending(false);
    },
  });

  return (
    <>
      <Title title={t('selectRole')} loading={pending} />
      <PaddingWrapper>
        <ContentWrapper>
          {ROLES.map((_role, index) => (
            <h3 key={index}>
              <RoleButton
                disabled={pending}
                onClick={() => {
                  setPending(true);
                  selectRole(_role);
                  submitTx();
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
