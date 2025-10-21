import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const WarningRedIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faTriangleExclamation}
      style={{ color: theme.icons.warningRedIcon.pathFill }}
    />
  );
};

export default WarningRedIcon;
