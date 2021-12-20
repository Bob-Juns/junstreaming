import React, { useState } from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';
import chevronIcon from '@assets/icons/chevron.svg';

import UserCard from './UserCard';

type Props = {
  users: User;
  intersection: AllUsers;
  message: string;
};

const UserList = ({ users, intersection, message }: Props) => {
  const LIMIT = 5;
  const [more, setMore] = useState<number>(LIMIT);

  const onClickShowMore = () => {
    setMore((prev) => prev + LIMIT);
  };

  const onClickFold = () => {
    setMore(LIMIT);
  };

  return (
    <Container>
      {intersection.length > 0 ? (
        intersection
          .slice(0, more)
          .map((user: CurrentUser) => (
            <UserCard key={user.userEmail} user={user} />
          ))
      ) : message !== '' ? (
        <Empty>{message}</Empty>
      ) : (
        users.filteredUsers.map((user: CurrentUser) => (
          <UserCard key={user.userEmail} user={user} />
        ))
      )}
      {intersection.length > LIMIT && (
        <Wrapper
          onClick={intersection.length >= more ? onClickShowMore : onClickFold}
        >
          <Text>{intersection.length >= more ? '더보기' : '접기'}</Text>
          <Chevron rotate={intersection.length >= more ? 1 : 0} />
        </Wrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: auto;
  grid-row-gap: 1.5rem;
`;

const Empty = styled.div`
  margin: 3rem auto 0;
  color: ${[(props) => props.theme.color.gray.base]};
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;

  cursor: pointer;
`;

const Text = styled.div`
  margin-right: 0.25rem;
  font-size: 0.625rem;
  font-weight: 700;

  color: ${(props) => props.theme.color.gray.base};
`;

const Chevron = styled(chevronIcon)<{ rotate: boolean }>`
  width: 0.625rem;
  color: ${(props) => props.theme.color.gray.base};
  transform: ${(props) => props.rotate && 'rotate(180deg)'};

  transition: transform 0.3s;
`;

const mapStateToProps = (state: { users: User }) => ({
  users: state.users,
});

export default connect(mapStateToProps)(UserList);