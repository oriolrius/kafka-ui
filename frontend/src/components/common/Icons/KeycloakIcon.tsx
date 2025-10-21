import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

function KeycloakIcon() {
  return (
    <FontAwesomeIcon
      icon={faKey}
      style={{ width: '800px', height: '800px', color: '#008aaa' }}
    />
  );
}

export default styled(KeycloakIcon)``;
