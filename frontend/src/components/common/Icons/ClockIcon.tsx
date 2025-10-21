import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const ClockIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faClock}
      style={{ color: theme.icons.clockIcon, width: '10px', height: '10px' }}
    />
  );
};

export default ClockIcon;
