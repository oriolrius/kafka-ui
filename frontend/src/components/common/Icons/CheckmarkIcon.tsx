import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const CheckmarkIcon: FC = () => {
  return (
    <FontAwesomeIcon
      icon={faCheck}
      style={{ color: '#FFFFFF', width: '12px', height: '12px' }}
    />
  );
};

export default CheckmarkIcon;
