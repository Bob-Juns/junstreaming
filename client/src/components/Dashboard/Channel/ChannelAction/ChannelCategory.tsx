import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import chevronIcon from '@assets/icons/chevron.svg';

import ChannelCategoryMenu from './ChannelCategoryMenu';

type Props = {
  inputs: ChannelInputs;
  setInputs: React.Dispatch<React.SetStateAction<ChannelInputs>>;
  messages: ChannelMessages;
  setMessages: React.Dispatch<React.SetStateAction<ChannelMessages>>;
};

const ChannelCategory = ({
  inputs,
  setInputs,
  messages,
  setMessages,
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const focusRef = useRef<HTMLDivElement>(null);

  const onClickOutside = (event: any) => {
    if (focusRef.current && !focusRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    isDropdownOpen && document.addEventListener('click', onClickOutside, true);
    return () => {
      document.removeEventListener('click', onClickOutside, true);
    };
  }, [focusRef, isDropdownOpen]);
  return (
    <Container>
      <Label>카테고리</Label>
      <Wrapper
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        ref={focusRef}
      >
        <ChannelCategoryMenu
          open={isDropdownOpen}
          inputs={inputs}
          setInputs={setInputs}
          messages={messages}
          setMessages={setMessages}
        />
        <Selected>{inputs.category === '' ? '선택' : inputs.category}</Selected>
        <Chevron open={isDropdownOpen} />
      </Wrapper>
      <Message>{messages.category}</Message>
    </Container>
  );
};

const Container = styled.div`
  width: calc(100vw / 2 - 2rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;

  ${(props) =>
    props.theme.device('tablet')(`
  width: calc(100% / 2 - 2rem);
  `)}
`;

const Label = styled.div`
  color: ${(props) => props.theme.color.purple};

  font-size: 1rem;
  font-weight: 700;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 2rem;
  margin-top: 0.75rem;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  background-color: ${(props) => props.theme.color.purple};
  border-radius: 3.125rem;

  cursor: pointer;

  ${(props) =>
    props.theme.device('tablet')(`
    height: 2.5rem;
  `)}
`;

const Selected = styled.div`
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
`;

const Chevron = styled(chevronIcon)<{ open: boolean }>`
  width: 0.625rem;
  color: #fff;

  position: absolute;
  right: 1rem;

  transform: ${(props) => (props.open ? 'rotate(0) ' : 'rotate(180deg)')};
  transition: all 0.3s linear;
`;

const Message = styled.div`
  width: 100%;
  height: 0.75rem;
  margin-top: 0.25rem;

  font-size: 0.75rem;
  color: ${(props) => props.theme.color.red};
`;

export default ChannelCategory;
