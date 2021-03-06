// common action type
type Action = {
  type: string;
  payload?: any;
};

type MessagePayload = {
  message: string;
};

interface MessageAction extends Action {
  payload: MessagePayload;
}

type MessageResponse = {
  payload: MessagePayload;
};

type ErrorMessageResponse = {
  response: { data: { message: string } };
};

type ErrorResponse = {
  response: { data: { message: string }; status: number };
};

type LoginInputs = {
  userEmail: string;
  userPassword: string;
};

interface LoginMessages extends LoginInputs {
  common: string;
}

interface RegisterInputs extends LoginInputs {
  confirmationCode: string;
  userName: string;
  userPasswordRecheck: string;
}

interface RegisterMessages extends RegisterInputs {
  common: string;
}

type EmailState = {
  isLoading: boolean;
  isSent: boolean;
  isConfirmed: boolean;
};

type ChannelInputs = {
  category: string;
  channelId: string;
  channelTitle: string;
  channelProducer: string;
  channelCast: string;
  playlistTitle: string;
  playlistId: string;
};

type BannerInputs = {
  bannerId: string;
  bannerTitle: string;
  bannerLink: string;
};

interface BannerMessages extends BannerInputs {
  bannerImage: string;
}

interface ChannelMessages extends ChannelInputs {
  channelCover: string;
}

type PasswordState = {
  userPassword: string;
  newPassword: string;
  recheck: string;
};

type FilterState = {
  query: string;
  filter: string | boolean;
};
