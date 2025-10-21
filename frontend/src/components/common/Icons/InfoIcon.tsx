import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const InfoIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faCircleInfo}
      style={{ color: theme.icons.infoIcon, width: '14px', height: '15px' }}
    />
  );
};

export default InfoIcon;
