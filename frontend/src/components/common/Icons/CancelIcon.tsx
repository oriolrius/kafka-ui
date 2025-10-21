import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

const CancelIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faBan}
      style={{ color: theme.icons.cancelIcon, width: '12px', height: '12px' }}
    />
  );
};

export default CancelIcon;
