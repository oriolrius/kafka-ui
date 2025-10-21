import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const FilterIcon = () => {
  return (
    <FontAwesomeIcon
      icon={faFilter}
      style={{ width: '12px', height: '12px' }}
    />
  );
};

export default styled(FilterIcon)``;
