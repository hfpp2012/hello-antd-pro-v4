import { Form, Input, Row, Col, Button, message } from 'antd';
import React from 'react';
import styles from './style.less';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { StateType } from './model';
import { connect } from 'dva';
import uuidv4 from 'uuid/v4';

interface RegisterProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  userRegister: StateType;
  submitting: boolean;
}

interface RegisterState {
  count: number;
  confirmDirty: boolean;
  image: string;
}

export interface CaptchaParams {
  mobile: string;
}

export interface UserRegisterParams {
  user: {
    email: string;
    username: string;
    password: string;
    password_confirmation: string;
    phone: string;
    code: string;
  };
  _rucaptcha: string;
}

@connect(
  ({
    userRegister,
    loading,
  }: {
    userRegister: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userRegister,
    submitting: loading.effects['userRegister/submit'],
  }),
)
class RegistrationForm extends React.Component<RegisterProps, RegisterState> {
  state: RegisterState = {
    count: 0,
    confirmDirty: false,
    image: 'http://localhost:5000/rucaptcha',
  };

  interval: number | undefined = undefined;

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      dispatch({
        type: 'userRegister/submit',
        payload: { ...values },
      });
    });
  };

  onGetCaptcha = () => {
    const { form, dispatch } = this.props;
    const phone = form.getFieldValue('user[phone]');

    if (phone === undefined || phone.trim() === '') {
      message.error('请填写手机号码');
      return;
    }

    let count = 59;
    this.setState({
      count,
    });
    this.interval = window.setInterval(() => {
      count -= 1;
      this.setState({
        count,
      });

      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);

    dispatch({
      type: 'userRegister/getCaptcha',
      payload: { mobile: phone },
    });
  };

  onGetCaptchaImage = () => {
    // const randomString =
    //   Math.random()
    //     .toString(36)
    //     .substring(2, 15) +
    //   Math.random()
    //     .toString(36)
    //     .substring(2, 15);
    const randomString = uuidv4();
    this.setState({
      image: `http://localhost:5000/rucaptcha?a=${randomString}`,
    });
  };

  render() {
    const { count, image } = this.state;

    const { submitting, form, userRegister } = this.props;

    const { getFieldDecorator } = form;

    const { errors } = userRegister;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <div className={styles.custom_form}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item
            validateStatus={errors.username ? 'error' : ''}
            help={errors.username ? errors.username.join(',') : ''}
            label={<span>Username&nbsp;</span>}
          >
            {getFieldDecorator('user[username]')(<Input />)}
          </Form.Item>
          <Form.Item
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email ? errors.email.join(',') : ''}
            label="E-mail"
          >
            {getFieldDecorator('user[email]')(<Input type="email" />)}
          </Form.Item>
          <Form.Item
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password ? errors.password.join(',') : ''}
            label="Password"
            hasFeedback
          >
            {getFieldDecorator('user[password]')(<Input.Password />)}
          </Form.Item>
          <Form.Item
            validateStatus={errors.password_confirmation ? 'error' : ''}
            help={errors.password_confirmation ? errors.password_confirmation.join(',') : ''}
            label="Confirm Password"
            hasFeedback
          >
            {getFieldDecorator('user[password_confirmation]')(<Input.Password />)}
          </Form.Item>

          <Form.Item
            validateStatus={errors.phone ? 'error' : ''}
            help={errors.phone ? errors.phone.join(',') : ''}
            label="Phone Number"
          >
            {getFieldDecorator('user[phone]')(<Input style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item
            validateStatus={errors.code ? 'error' : ''}
            help={errors.code ? errors.code.join(',') : ''}
            label="Captcha"
            extra="We must make sure that your are a human."
          >
            <Row gutter={8}>
              <Col span={12}>{getFieldDecorator('user[code]')(<Input />)}</Col>
              <Col span={12}>
                <Button
                  disabled={!!count}
                  className={styles.getCaptcha}
                  onClick={this.onGetCaptcha}
                >
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            validateStatus={errors.rucaptcha ? 'error' : ''}
            help={errors.rucaptcha ? errors.rucaptcha.join(',') : ''}
            label="图形验证码"
          >
            <Row gutter={8}>
              <Col span={12}>{getFieldDecorator('_rucaptcha')(<Input />)}</Col>
              <Col span={12}>
                <img className={styles.captcha_img} src={image} onClick={this.onGetCaptchaImage} />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button loading={submitting} type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create<RegisterProps>({ name: 'register' })(RegistrationForm);
