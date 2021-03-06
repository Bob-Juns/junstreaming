import React from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import plusIcon from '@assets/icons/plus.svg';

const BannerCreateButton = () => {
  const navigate = useNavigate();

  return (
    <Button type="button" onClick={() => navigate('/banner-create')}>
      <Plus />
    </Button>
  );
};

const Button = styled.button`
  width: 2rem;
  height: 2rem;
  margin-right: 0.375rem;

  background-color: ${(props) => props.theme.color.purple};
  box-shadow: ${(props) => props.theme.boxShadow.primary};

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
  cursor: pointer;

  ${(props) =>
    props.theme.device('tablet')(`
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 0.5rem;
  `)}
`;

const Plus = styled(plusIcon)`
  width: 0.75rem;
  height: 0.75rem;

  color: #fff;

  ${(props) =>
    props.theme.device('tablet')(`
  width: 1rem;
  height: 1rem;
  `)}
`;

export default BannerCreateButton;
