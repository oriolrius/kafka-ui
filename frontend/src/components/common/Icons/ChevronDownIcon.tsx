import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

type ChevronDownIconProps = {
  fill?: string;
  width?: string;
  height?: string;
  viewBox?: string;
};

const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({
  fill,
  width,
  height,
}) => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faChevronDown}
      style={{
        color: fill || theme.icons.chevronDownIcon,
        width: width || '10px',
        height: height || '6px',
      }}
    />
  );
};

export default ChevronDownIcon;
