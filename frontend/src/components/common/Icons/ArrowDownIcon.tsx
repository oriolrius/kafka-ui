import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

const ArrowDownIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faArrowDown}
      style={{
        color: theme.icons.arrowDownIcon,
        width: '10px',
        height: '10px',
      }}
    />
  );
};

export default ArrowDownIcon;
