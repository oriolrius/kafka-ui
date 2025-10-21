import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

function GoogleIcon() {
  return (
    <FontAwesomeIcon
      icon={faGoogle}
      style={{ width: '64px', height: '64px' }}
    />
  );
}

export default styled(GoogleIcon)``;
