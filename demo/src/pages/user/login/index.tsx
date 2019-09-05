import { Alert } from 'antd';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import { StateType } from './model';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<any>;
  userLogin: StateType;
  submitting: boolean;
}
interface LoginState {
  type: string;
}
export interface FormDataType {
  userName: string;
  password: string;
}

@connect(
  ({
    userLogin,
    loading,
  }: {
    userLogin: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userLogin,
    submitting: loading.effects['userLogin/login'],
  }),
)
class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
  };

  handleSubmit = (err: any, values: FormDataType) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'userLogin/login',
        payload: { ...values },
      });
    }
  };

  renderMessage = (content: string) => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userLogin, submitting } = this.props;
    const { success } = userLogin;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          ref={(form: any) => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="账户密码登录">
            {success === false && !submitting && this.renderMessage('账户或密码错误')}
            <UserName
              name="user[login]"
              placeholder={`${'用户名'}: 用户名、邮箱、手机号`}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <Password
              name="user[password]"
              placeholder={`${'密码'}: 密码`}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm!.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
