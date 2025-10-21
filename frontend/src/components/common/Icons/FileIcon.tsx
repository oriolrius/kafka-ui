import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

const FileIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faFile}
      style={{ color: theme.icons.fileIcon, width: '10px', height: '10px' }}
    />
  );
};

export default FileIcon;
