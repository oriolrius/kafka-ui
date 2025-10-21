import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const CheckMarkRoundIcon: React.FC = () => {
  return (
    <FontAwesomeIcon
      icon={faCircleCheck}
      style={{ color: '#33CC66', width: '14px', height: '14px' }}
    />
  );
};

export default CheckMarkRoundIcon;
