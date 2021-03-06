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
import ResetPasswordModal from './ResetPasswordModal';

import { isEmailFormat } from '@utils/formatCheck';
import { toast } from 'react-toastify';

type Props = {
  login: (loginData: LoginData) => any;
};

const LoginForm = ({ login }: Props) => {
  const [inputs, setInputs] = useState<LoginInputs>({
    userEmail: '',
    userPassword: '',
  });

  const [messages, setMessages] = useState<LoginMessages>({
    userEmail: '',
    userPassword: '',
    common: '',
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPasswordHide, setIsPasswordHide] = useState<boolean>(true);

  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

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
            userEmail: '올바른 이메일 형식이 아닙니다.',
          });
    } else {
      value === '' || value.length >= 4
        ? setMessages({ ...messages, userPassword: '' })
        : setMessages({
            ...messages,
            userPassword: '4 ~ 16자리의 비밀번호를 입력해 주세요.',
          });
    }

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onClickPasswordState = async () => {
    setIsPasswordHide((prev) => !prev);
    await passwordRef.current?.setSelectionRange(
      inputs.userPassword.length,
      inputs.userPassword.length,
    );
    passwordRef.current?.focus();
  };

  const onSubmitForm = (
    event: React.FormEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (inputs.userEmail === '') {
      setMessages({ ...messages, userEmail: '이메일을 입력하세요.' });
      emailRef.current?.focus();
    } else if (inputs.userPassword === '') {
      setMessages({ ...messages, userPassword: '비밀번호를 입력하세요.' });
      passwordRef.current?.focus();
    } else {
      login({ userEmail: inputs.userEmail, userPassword: inputs.userPassword })
        .then((response: { payload: { message: string } }) => {
          setInputs({ userEmail: '', userPassword: '' });
          navigate('/');
          toast.success(response.payload.message);
        })
        .catch(
          (error: {
            response: { status: number; data: { message: string } };
          }) => {
            if (error.response.status === 404) {
              setMessages({
                userEmail: '',
                userPassword: '',
                common: error.response.data.message,
              });
              setInputs({ ...inputs, userEmail: '', userPassword: '' });
              emailRef.current?.focus();
            } else if (
              error.response.data.message == '비밀번호가 일치하지 않습니다.'
            ) {
              setMessages({
                ...messages,
                common: error.response.data.message,
              });
              setInputs({
                ...inputs,
                userPassword: '',
              });
              passwordRef.current?.focus();
            } else {
              setMessages({
                userEmail: '',
                userPassword: '',
                common: error.response.data.message,
              });
              setInputs({
                userEmail: '',
                userPassword: '',
              });
              emailRef.current?.focus();
            }
          },
        );
    }
  };

  return (
    <>
      <AccountForm
        ask="회원이 아니신가요?"
        link="회원가입"
        onClickLink={() => navigate('/register')}
        onSubmitForm={onSubmitForm}
      >
        {messages.common !== '' && <AccountWarning message={messages.common} />}
        <AccountInput
          message={messages.userEmail}
          type="email"
          id="userEmail"
          mode="email"
          refs={emailRef}
          value={inputs.userEmail}
          placeholder="이메일을 입력하세요."
          onChange={onChangeInputs}
          label="이메일"
        />
        <Wrapper>
          <AccountInput
            message={messages.userPassword}
            type={isPasswordHide ? 'password' : 'text'}
            id="userPassword"
            refs={passwordRef}
            value={inputs.userPassword}
            placeholder="비밀번호를 입력하세요."
            onChange={onChangeInputs}
            label="비밀번호"
          />
          <PasswordState onClick={onClickPasswordState} isHide={isPasswordHide}>
            {isPasswordHide ? 'show' : 'hide'}
          </PasswordState>
        </Wrapper>
        <FindPassword onClick={() => setIsModalOpen(true)}>
          비밀번호 찾기
        </FindPassword>
        <AccountButton type="submit" onClick={onSubmitForm} text="로그인" />
        <KakaoLogin messages={messages} setMessages={setMessages} />
      </AccountForm>
      <ResetPasswordModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const PasswordState = styled.div<{ isHide: boolean }>`
  color: ${(props) =>
    props.isHide ? props.theme.color.gray.base : props.theme.color.red};
  font-size: 0.75rem;

  position: absolute;
  right: 0;
  bottom: 1.875rem;

  cursor: pointer;

  &:hover {
    font-weight: 700;
  }
`;

const FindPassword = styled.div`
  width: fit-content;
  margin-left: auto;

  font-size: 0.75rem;

  color: ${(props) => props.theme.color.gray.base};

  cursor: pointer;

  &: hover {
    font-weight: 700;
  }
`;

const mapDispatchToProps = (dispatch: Dispatch<UserAction>) => ({
  login: (loginData: LoginData) => dispatch(actions.login(loginData)),
});

export default connect(null, mapDispatchToProps)(LoginForm);
