import React from 'react';
import Styled from './styles';
import Icon from '/imports/ui/components/common/icon/component';
import UserListService from '/imports/ui/components/user-list/service';
import { User, VideoItem } from '/imports/ui/components/video-provider/video-provider-graphql/types';

interface UserAvatarVideoProps {
  user: Partial<User>;
  stream: VideoItem;
  // eslint-disable-next-line react/require-default-props
  voiceUser?: {
    talking?: boolean;
  };
  squeezed: boolean;
  unhealthyStream: boolean;
}

const UserAvatarVideo: React.FC<UserAvatarVideoProps> = (props) => {
  const {
    user, stream, unhealthyStream, squeezed, voiceUser = { talking: false },
  } = props;
  const data = { ...user, ...stream };
  const {
    name = '', color = '', avatar = '', emoji = '', isModerator,
  } = data;
  let {
    presenter, clientType,
  } = data;

  const { talking = false } = voiceUser;

  const handleUserIcon = () => {
    if (emoji !== 'none') {
      // @ts-expect-error -> Untyped component.
      return <Icon iconName={UserListService.normalizeEmojiName(emoji)} />;
    }
    return name.toLowerCase().slice(0, 2);
  };

  // hide icons when squeezed
  if (squeezed) {
    presenter = false;
    clientType = '';
  }

  return (
    <Styled.UserAvatarStyled
      moderator={isModerator}
      presenter={presenter}
      dialIn={clientType === 'dial-in-user'}
      color={color}
      emoji={emoji !== 'none'}
      avatar={avatar}
      unhealthyStream={unhealthyStream}
      talking={talking}
      whiteboardAccess={undefined}
    >
      {handleUserIcon()}
    </Styled.UserAvatarStyled>
  );
};

export default UserAvatarVideo;
