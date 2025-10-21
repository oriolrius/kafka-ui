import React, { CSSProperties } from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

interface Props {
  isOpen: boolean;
  style?: CSSProperties;
  color?: string;
}

const DropdownArrowIcon: React.FC<Props> = ({ isOpen }) => {
  const theme = useTheme();

  return (
    <FontAwesomeIcon
      icon={faCaretDown}
      style={{
        color: theme.icons.dropdownArrowIcon,
        width: '10px',
        height: '5px',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    />
  );
};

export default DropdownArrowIcon;
