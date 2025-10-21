import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <FontAwesomeIcon
    icon={faGithub}
    className={className}
    style={{ width: '20px', height: '20px' }}
  />
);

export default styled(GitHubIcon)``;
