import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const EditIcon: React.FC<{ className?: string }> = ({ className }) => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faPenToSquare}
      className={className}
      style={{
        color: theme.icons.editIcon.normal,
        width: '13px',
        height: '14px',
      }}
    />
  );
};

export default styled(EditIcon)``;
