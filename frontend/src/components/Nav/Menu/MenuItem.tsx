import React, { type FC, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import * as S from './styled';

export interface MenuItemProps {
  to: string;
  title: string;
  variant?: 'primary' | 'secondary';
  isActive?: boolean;
  icon?: ReactNode;
}

const MenuItem: FC<MenuItemProps> = ({
  title,
  to,
  isActive,
  variant = 'secondary',
  icon,
}) => (
  <NavLink to={to} title={title}>
    <S.MenuItem $isActive={isActive} $variant={variant}>
      {icon && (
        <span
          style={{
            marginRight: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </span>
      )}
      {title}
    </S.MenuItem>
  </NavLink>
);

export default MenuItem;
