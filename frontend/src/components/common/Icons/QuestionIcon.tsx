import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

const QuestionIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <FontAwesomeIcon
      icon={faCircleQuestion}
      style={{ color: theme.icons.savedIcon, width: '19px', height: '19px' }}
    />
  );
};

export default QuestionIcon;
