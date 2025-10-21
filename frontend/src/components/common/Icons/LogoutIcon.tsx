import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const LogoutIcon = () => {
  return (
    <FontAwesomeIcon
      icon={faRightFromBracket}
      style={{ width: '20px', height: '20px' }}
    />
  );
};

export default LogoutIcon;
