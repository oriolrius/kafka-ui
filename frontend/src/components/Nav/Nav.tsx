import React, { type FC } from 'react';
import { useClusters } from 'lib/hooks/api/clusters';
import useCurrentClusterName from 'lib/hooks/useCurrentClusterName';
import UserIcon from 'components/common/Icons/UserIcon';
import LogoutIcon from 'components/common/Icons/LogoutIcon';
import { useAppInfo } from 'lib/hooks/api/appConfig';

import * as S from './Nav.styled';
import MenuItem from './Menu/MenuItem';
import ClusterMenu from './ClusterMenu/ClusterMenu';

const Nav: FC = () => {
  const clusters = useClusters();
  const clusterName = useCurrentClusterName();
  const appInfo = useAppInfo();
  const userMenu = appInfo.data?.response.ui?.userMenu;

  return (
    <S.NavContainer aria-label="Sidebar Menu">
      <S.List>
        <MenuItem variant="primary" to="/" title="Dashboard" />
      </S.List>
      {clusters.isSuccess &&
        clusters.data.map((cluster) => (
          <ClusterMenu
            key={cluster.name}
            name={cluster.name}
            status={cluster.status}
            features={cluster.features}
            opened={clusters.data.length === 1 || cluster.name === clusterName}
          />
        ))}
      {userMenu?.enabled && (
        <S.UserMenuWrapper>
          {userMenu.accountUrl && (
            <S.UserMenuItem href={userMenu.accountUrl} target="_blank" rel="noopener noreferrer">
              <UserIcon />
              Account
            </S.UserMenuItem>
          )}
          {userMenu.logoutUrl && (
            <S.UserMenuItem href={userMenu.logoutUrl}>
              <LogoutIcon />
              Logout
            </S.UserMenuItem>
          )}
        </S.UserMenuWrapper>
      )}
    </S.NavContainer>
  );
};

export default Nav;
