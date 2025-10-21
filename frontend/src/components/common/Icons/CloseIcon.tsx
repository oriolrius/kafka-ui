import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faXmark}
      className={className}
      style={{
        color: theme.icons.closeIcon.normal,
        width: '10px',
        height: '10px',
      }}
    />
  );
};

export default styled(CloseIcon)``;
