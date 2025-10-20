import React, { type FC } from 'react';
import { useClusters } from 'lib/hooks/api/clusters';
import useCurrentClusterName from 'lib/hooks/useCurrentClusterName';
import UserIcon from 'components/common/Icons/UserIcon';
import LogoutIcon from 'components/common/Icons/LogoutIcon';

import * as S from './Nav.styled';
import MenuItem from './Menu/MenuItem';
import ClusterMenu from './ClusterMenu/ClusterMenu';

const Nav: FC = () => {
  const clusters = useClusters();
  const clusterName = useCurrentClusterName();

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
      <S.UserMenuWrapper>
        <S.UserMenuItem href="https://iam.demo.m3.nexiona.io/realms/server/account" target="_blank" rel="noopener noreferrer">
          <UserIcon />
          Account
        </S.UserMenuItem>
        <S.UserMenuItem href="https://console.demo.m3.nexiona.io/oauth2/sign_out">
          <LogoutIcon />
          Logout
        </S.UserMenuItem>
      </S.UserMenuWrapper>
    </S.NavContainer>
  );
};

export default Nav;
