import React, { useEffect, useState, useRef, Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { actions } from 'store';

import styled from 'styled-components';

import AccountWarning from '@components/Common/Account/AccountWarning';
import AccountForm from '@components/Common/Account/AccountForm';
import AccountInput from '@components/Common/Account/AccountInput';
import AccountButton from '@components/Common/Account/AccountButton';
import KakaoLogin from '@components/User/Login/KakaoLogin';

import spinnerIcon from '@assets/icons/spinner.gif';

import { isEmailFormat } from '@utils/formatCheck';
import { toast } from 'react-toastify';

type Props = {
  emailConfirmation: (userEmail: string) => any;
  register: (registerData: RegisterData) => any;
};

const RegisterForm = ({ emailConfirmation, register }: Props) => {
  const [emailState, setEmailState] = useState<EmailState>({
    isLoading: false,
    isSent: false,
    isConfirmed: false,
  });
  const [inputs, setInputs] = useState<RegisterInputs>({
    userEmail: '',
    confirmationCode: '',
    userName: '',
    userPassword: '',
    userPasswordRecheck: '',
  });

  const [messages, setMessages] = useState<RegisterMessages>({
    userEmail: '',
    confirmationCode: '',
    userName: '',
    userPassword: '',
    userPasswordRecheck: '',
    common: '',
  });

  const [confirmationCode, setConfirmationCode] = useState<string>('');

  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const recheckRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onChangeInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    if (name === 'userEmail') {
      value === '' || isEmailFormat(value)
        ? setMessages({ ...messages, userEmail: '' })
        : setMessages({
            ...messages,
            userEmail: '????????? ????????? ????????? ????????????.',
          });
    } else if (name === 'confirmationCode') {
      value === '' || value.length === 6
        ? setMessages({ ...messages, confirmationCode: '' })
        : setMessages({
            ...messages,
            confirmationCode: '6?????? ??????????????? ??????????????????. ',
          });
    } else if (name === 'userName') {
      value === '' || value.length < 10
        ? setMessages({ ...messages, userName: '' })
        : setMessages({
            ...messages,
            userName: '2 ~ 10????????? ????????? ??????????????????.',
          });
    } else if (name === 'userPassword') {
      value === '' || value.length >= 4
        ? setMessages({ ...messages, userPassword: '' })
        : value.length < 4
        ? setMessages({
            ...messages,
            userPassword: '4?????? ????????? ??????????????? ??????????????????.',
          })
        : value.length > 16 &&
          setMessages({
            ...messages,
            userPassword: '16?????? ????????? ??????????????? ??????????????????.',
          });
    }

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onClickSendEmail = (
    event: React.FormEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setEmailState({ ...emailState, isLoading: true });
    if (!isEmailFormat(inputs.userEmail)) {
      setMessages({
        ...messages,
        common: '????????? ????????? ????????? ????????????.',
      });
      setInputs({ ...inputs, userEmail: '' });
      setEmailState({ ...emailState, isLoading: false });
      emailRef.current?.focus();
    } else {
      emailConfirmation(inputs.userEmail)
        .then((response: { payload: { message: string; code: string } }) => {
          setConfirmationCode(response.payload.code);
          setEmailState({
            ...emailState,
            isSent: true,
            isLoading: false,
          });
          setMessages({ ...messages, common: '' });
          toast.success(response.payload.message);
          codeRef.current?.focus();
        })
        .catch((error: { response: { data: { message: string } } }) => {
          setMessages({
            ...messages,
            userEmail: '',
            confirmationCode: '',
            common: error.response.data.message,
          });
          setEmailState({ ...emailState, isLoading: false });
          setInputs({ ...inputs, userEmail: '', confirmationCode: '' });
          emailRef.current?.focus();
        });
    }
  };

  const onClickConfirmEmail = (
    event: React.FormEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (inputs.confirmationCode === '') {
      setMessages({ ...messages, common: '??????????????? ??????????????????.' });
      codeRef.current?.focus();
    } else if (inputs.confirmationCode.length !== 6) {
      setMessages({
        ...messages,
        common: '6?????? ??????????????? ??????????????????.',
      });
      setInputs({ ...inputs, confirmationCode: '' });
      codeRef.current?.focus();
    } else if (inputs.confirmationCode !== confirmationCode) {
      setMessages({
        ...messages,
        common: '??????????????? ???????????? ????????????.',
      });
      setInputs({ ...inputs, confirmationCode: '' });
      codeRef.current?.focus();
    } else {
      setEmailState({ ...emailState, isConfirmed: true });
      nameRef.current?.focus();
    }
  };

  const onClickReset = () => {
    setEmailState({
      isSent: false,
      isLoading: false,
      isConfirmed: false,
    });
    setConfirmationCode('');
    setMessages({ ...messages, common: '' });
    setInputs({ ...inputs, userEmail: '', confirmationCode: '' });

    emailRef.current?.focus();
  };

  const onSubmitForm = (
    event: React.FormEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (inputs.userName === '') {
      setMessages({ ...messages, common: '????????? ??????????????????.' });
      nameRef.current?.focus();
    } else if (inputs.userPassword === '') {
      setMessages({ ...messages, common: '??????????????? ??????????????????.' });
      passwordRef.current?.focus();
    } else if (inputs.userPassword !== inputs.userPasswordRecheck) {
      setMessages({ ...messages, common: '??????????????? ???????????? ????????????.' });
      setInputs({ ...inputs, userPasswordRecheck: '' });
      recheckRef.current?.focus();
    } else {
      register({
        userName: inputs.userName,
        userId: inputs.userEmail,
        userEmail: inputs.userEmail,
        userPassword: inputs.userPassword,
      })
        .then((response: MessageResponse) => {
          navigate('/login', { replace: true });
          toast.success(response.payload.message);
        })
        .catch(
          (error: {
            response: { status: number; data: { message: string } };
          }) => console.log(error),
        );
    }
  };

  return (
    <AccountForm
      ask="?????? ???????????????????"
      link="?????????"
      onClickLink={() => navigate('/login')}
      onSubmitForm={
        emailState.isConfirmed
          ? onSubmitForm
          : emailState.isSent
          ? onClickConfirmEmail
          : onClickSendEmail
      }
    >
      {messages.common !== '' && <AccountWarning message={messages.common} />}
      <Wrapper>
        <AccountInput
          message={messages.userEmail}
          type="email"
          id="userEmail"
          mode="email"
          refs={emailRef}
          value={inputs.userEmail}
          placeholder="???????????? ???????????????"
          onChange={onChangeInputs}
          label="?????????"
          disabled={emailState.isSent ? true : false}
        />
        {emailState.isLoading ? (
          <Spinner src={spinnerIcon} />
        ) : (
          emailState.isSent && <Reset onClick={onClickReset}>??????</Reset>
        )}
      </Wrapper>
      {emailState.isSent && !emailState.isConfirmed && (
        <AccountInput
          message={messages.confirmationCode}
          type="text"
          id="confirmationCode"
          refs={codeRef}
          value={inputs.confirmationCode}
          placeholder="??????????????? ???????????????."
          onChange={onChangeInputs}
          label="????????????"
        />
      )}
      {emailState.isConfirmed && (
        <>
          <AccountInput
            message={messages.userName}
            type="text"
            id="userName"
            refs={nameRef}
            value={inputs.userName}
            placeholder="????????? ???????????????."
            onChange={onChangeInputs}
            label="??????"
          />
          <AccountInput
            message={messages.userPassword}
            type="password"
            id="userPassword"
            refs={passwordRef}
            value={inputs.userPassword}
            placeholder="??????????????? ???????????????."
            onChange={onChangeInputs}
            max={18}
            label="????????????"
          />
          <AccountInput
            message={messages.userPasswordRecheck}
            type="password"
            id="userPasswordRecheck"
            refs={recheckRef}
            value={inputs.userPasswordRecheck}
            placeholder="??????????????? ?????? ??? ???????????????."
            onChange={onChangeInputs}
            max={18}
            label="???????????? ??????"
          />
        </>
      )}
      <AccountButton
        type="submit"
        onClick={
          emailState.isConfirmed
            ? onSubmitForm
            : emailState.isSent
            ? onClickConfirmEmail
            : onClickSendEmail
        }
        text={
          emailState.isConfirmed
            ? '????????????'
            : emailState.isSent
            ? '????????????'
            : '???????????? ??????'
        }
      />
      {!emailState.isConfirmed && (
        <KakaoLogin messages={messages} setMessages={setMessages} />
      )}
    </AccountForm>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const Spinner = styled.img`
  width: 1.25rem;

  position: absolute;
  top: 50%;
  right: 0.25rem;
  transform: translateY(-50%);
`;

const Reset = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.color.purple};

  position: absolute;
  bottom: 1.875rem;
  right: 0.25rem;

  cursor: pointer;

  &:hover {
    font-weight: 700;
  }
`;

const mapDispatchToProps = (dispatch: Dispatch<UserAction>) => ({
  emailConfirmation: (userEmail: string) =>
    dispatch(actions.emailConfirmation(userEmail)),
  register: (registerData: RegisterData) =>
    dispatch(actions.register(registerData)),
});

export default connect(null, mapDispatchToProps)(RegisterForm);
