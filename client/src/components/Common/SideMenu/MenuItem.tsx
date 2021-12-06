import React from 'react';

import styled from 'styled-components';
import chevronIcon from '@assets/icons/chevron.svg';

type Props = {
  title: string;
};

const MenuItem = ({ title }: Props) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Chevron />
    </Container>
  );
};

const Title = styled.div`
  font-size: 1rem;
  font-weight: 700;
`;

const Chevron = styled(chevronIcon)`
  width: 1rem;
  transform: rotate(90deg);
  color: ${(props) => props.theme.color.gray};
`;

const Container = styled.div`
  width: calc(100% - 2rem);
  margin: 0 1rem;
  padding: 1.25rem 0 1.25rem 0.25rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 2px solid rgba(173, 181, 189, 0.5);

  cursor: pointer;

  &: hover {
    border-bottom: 2px solid ${(props) => props.theme.color.purple};
    ${Title}, ${Chevron} {
      color: ${(props) => props.theme.color.purple};
    }
  }
`;

export default MenuItem;
