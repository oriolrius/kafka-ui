import React from 'react';
import * as S from 'components/common/Icons/MessageToggleIcon.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus, faSquarePlus } from '@fortawesome/free-solid-svg-icons';

interface Props {
  isOpen: boolean;
}

const MessageToggleIcon: React.FC<Props> = ({ isOpen }) => {
  return (
    <S.Svg isOpen={isOpen} width="16" height="16" viewBox="0 0 16 16">
      <FontAwesomeIcon
        icon={isOpen ? faSquareMinus : faSquarePlus}
        style={{ width: '16px', height: '16px' }}
      />
    </S.Svg>
  );
};

export default MessageToggleIcon;
