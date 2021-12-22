import React, { useState } from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';
import chevronIcon from '@assets/icons/chevron.svg';
import ChannelCard from '@components/Dashboard/Channel/ChannelList/ChannelCard';

type Props = {
  channels: Channel;
};

const ChannelList = ({ channels }: Props) => {
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
      {channels.intersection.length > 0
        ? channels.intersection
            .slice(0, more)
            .map((channel: CurrentChannel) => (
              <ChannelCard
                key={channel.channelId}
                category={channel.category}
                channelTitle={channel.channelTitle}
                channelId={channel.channelId}
              />
            ))
        : channels.filteredChannels.length > 0 &&
          channels.filteredChannels
            .slice(0, more)
            .map((channel: CurrentChannel) => (
              <ChannelCard
                key={channel.channelId}
                category={channel.category}
                channelTitle={channel.channelTitle}
                channelId={channel.channelId}
              />
            ))}
      {channels.intersection.length > LIMIT && (
        <Wrapper
          onClick={
            channels.intersection.length >= more ? onClickShowMore : onClickFold
          }
        >
          <Text>
            {channels.intersection.length >= more ? '더보기' : '접기'}
          </Text>
          <Chevron rotate={channels.intersection.length >= more ? 1 : 0} />
        </Wrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: auto;
  grid-row-gap: 1rem;
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

const mapStateToProps = (state: { channels: Channel }) => ({
  channels: state.channels,
});

export default connect(mapStateToProps)(ChannelList);
