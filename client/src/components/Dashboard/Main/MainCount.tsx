import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import MainCountCard from '@components/Dashboard/Main/MainCountCard';

type Props = {
  users: User;
};

const Count = ({ users }: Props) => {
  return (
    <Container>
      <MainCountCard title="users" count={users.allUsers.length} />
      <MainCountCard title="channels" count={24} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(auto-fit, 1fr);
  grid-row-gap: 0.75rem;
  grid-column-gap: 0.375rem;
`;

const mapStateToProps = (state: { users: User }) => ({
  users: state.users,
});

export default connect(mapStateToProps)(Count);