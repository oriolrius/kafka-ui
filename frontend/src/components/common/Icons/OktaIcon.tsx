import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';

function OktaIcon() {
  return (
    <FontAwesomeIcon
      icon={faShieldHalved}
      style={{ width: '100px', height: '134.7px', color: '#007dc1' }}
    />
  );
}

export default styled(OktaIcon)``;
