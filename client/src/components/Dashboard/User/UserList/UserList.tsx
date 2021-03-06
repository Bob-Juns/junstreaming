import React, { useState } from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';
import chevronIcon from '@assets/icons/chevron.svg';

import UserCard from './UserCard';

type Props = {
  users: User;
};

const UserList = ({ users }: Props) => {
  const LIMIT = 6;
  const [more, setMore] = useState<number>(LIMIT);

  const onClickShowMore = () => {
    setMore((prev) => prev + LIMIT);
  };

  const onClickFold = () => {
    setMore(LIMIT);
  };

  return (
    <Container>
      {users.filteredUsers.length > 0 ? (
        users.filteredUsers
          .slice(0, more)
          .map((user: CurrentUser) => (
            <UserCard key={user.userEmail} user={user} />
          ))
      ) : (
        <Empty>일치하는 유저가 없습니다.</Empty>
      )}
      {users.filteredUsers.length > LIMIT && (
        <Wrapper
          onClick={
            users.filteredUsers.length >= more ? onClickShowMore : onClickFold
          }
        >
          <Text>{users.filteredUsers.length >= more ? '더보기' : '접기'}</Text>
          <Chevron rotate={users.filteredUsers.length >= more ? 1 : 0} />
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

  ${(props) =>
    props.theme.device('tablet')(`
  grid-template-columns: repeat(2, 1fr);
  grid-row-gap: 1.75rem;
  grid-column-gap: 1.5rem;
  margin-bottom: 3rem;
  position: relative;
  `)}
`;

const Empty = styled.div`
  margin: 3rem auto 0;
  color: ${(props) => props.theme.color.gray.base};

  ${(props) =>
    props.theme.device('tablet')(`
  width: 700px;
  font-size: 1.125rem;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: -2rem;
  `)}
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;

  cursor: pointer;

  ${(props) =>
    props.theme.device('tablet')(`
  width: 700px;
  font-size: 1.125rem;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: -2rem;
  `)}
`;

const Text = styled.div`
  margin-right: 0.25rem;
  font-size: 0.625rem;
  font-weight: 700;

  color: ${(props) => props.theme.color.gray.base};

  ${(props) =>
    props.theme.device('tablet')(`
  font-size: 1rem;
  margin-right: 0.375rem;
  `)}
`;

const Chevron = styled(chevronIcon)<{ rotate: boolean }>`
  width: 0.625rem;
  color: ${(props) => props.theme.color.gray.base};
  transform: ${(props) => props.rotate && 'rotate(180deg)'};

  transition: transform 0.3s;

  ${(props) =>
    props.theme.device('tablet')(`
  width: 1rem;
  `)}
`;

const mapStateToProps = (state: { users: User }) => ({
  users: state.users,
});

export default connect(mapStateToProps)(UserList);
