import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

const MoonIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faMoon}
      style={{ color: theme.icons.moonIcon, width: '11px', height: '11.99px' }}
    />
  );
};

export default MoonIcon;
