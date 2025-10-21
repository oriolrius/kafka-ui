import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const CloseCircleIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faCircleXmark}
      style={{
        color: theme.icons.closeCircleIcon,
        width: '16px',
        height: '16px',
      }}
    />
  );
};

export default CloseCircleIcon;
