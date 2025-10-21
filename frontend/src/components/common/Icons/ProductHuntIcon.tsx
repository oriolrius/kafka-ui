import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';

const ProductHuntIcon: React.FC<{ className?: string }> = ({ className }) => (
  <FontAwesomeIcon
    icon={faProductHunt}
    className={className}
    style={{ width: '24px', height: '25px' }}
  />
);

export default styled(ProductHuntIcon)``;
