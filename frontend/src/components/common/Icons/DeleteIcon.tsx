import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const DeleteIcon: React.FC<{ fill?: string }> = ({ fill }) => {
  const theme = useTheme();
  const currentFill = fill || theme.editFilter.deleteIconColor;
  return (
    <FontAwesomeIcon
      icon={faTrashCan}
      style={{ color: currentFill, width: '14px', height: '14px' }}
    />
  );
};

export default DeleteIcon;
