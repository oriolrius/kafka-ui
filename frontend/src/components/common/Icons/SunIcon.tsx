import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';

const SunIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon icon={faSun} style={{ color: theme.icons.sunIcon }} />
  );
};

export default SunIcon;
