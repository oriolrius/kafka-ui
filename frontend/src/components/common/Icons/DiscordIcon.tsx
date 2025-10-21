import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <FontAwesomeIcon
    icon={faDiscord}
    className={className}
    style={{ width: '22px', height: '18px' }}
  />
);

export default styled(DiscordIcon)``;
