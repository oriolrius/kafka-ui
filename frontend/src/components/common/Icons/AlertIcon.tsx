import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

interface Props {
  fill?: string;
}

const AlertIcon: React.FC<Props> = ({ fill }) => {
  return (
    <FontAwesomeIcon
      icon={faTriangleExclamation}
      style={{ color: fill ?? '#E63B19', width: '16px', height: '16px' }}
    />
  );
};

export default AlertIcon;
