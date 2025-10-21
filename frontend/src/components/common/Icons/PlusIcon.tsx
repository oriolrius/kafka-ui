import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const PlusIcon: React.FC = () => {
  return (
    <FontAwesomeIcon icon={faPlus} style={{ width: '14px', height: '14px' }} />
  );
};

export default PlusIcon;
