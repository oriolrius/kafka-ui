import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

const AutoIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faWandMagicSparkles}
      style={{ color: theme.icons.autoIcon, width: '14px', height: '15px' }}
    />
  );
};

export default AutoIcon;
