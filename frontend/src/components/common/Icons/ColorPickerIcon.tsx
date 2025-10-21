import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette } from '@fortawesome/free-solid-svg-icons';

const ColorPickerIcon: React.FC = () => {
  return (
    <FontAwesomeIcon
      icon={faPalette}
      style={{ width: '16px', height: '16px' }}
    />
  );
};

export default ColorPickerIcon;
