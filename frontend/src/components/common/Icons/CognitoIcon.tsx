import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAws } from '@fortawesome/free-brands-svg-icons';

function CognitoIcon() {
  return (
    <FontAwesomeIcon
      icon={faAws}
      style={{ width: '80px', height: '80px', color: '#FF9900' }}
    />
  );
}

export default styled(CognitoIcon)``;
