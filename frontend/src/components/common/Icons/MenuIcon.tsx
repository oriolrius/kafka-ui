import React, { type FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const MenuIcon: FC = () => (
  <FontAwesomeIcon icon={faBars} style={{ width: '24px', height: '24px' }} />
);

export default MenuIcon;
