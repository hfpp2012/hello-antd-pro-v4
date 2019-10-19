import { Button, Form, Input, Modal, Alert } from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { MovieItem } from '../data.d';

export interface FormValueType extends Partial<MovieItem> {
  id?: number;
  weight?: number;
  time?: string;
  title?: string;
}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: FormValueType) => void;
  handleUpdate: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<MovieItem>;
  errorMessage?: string;
}
const FormItem = Form.Item;

export interface UpdateFormState {
  formVals: FormValueType;
}

class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: UpdateFormProps) {
    super(props);

    this.state = {
      formVals: {
        title: props.values.title,
        weight: props.values.weight,
        time: props.values.time,
        id: props.values.id,
      },
    };
  }

  handleNext = () => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          handleUpdate(formVals);
        },
      );
    });
  };

  renderContent = (formVals: FormValueType) => {
    const { form } = this.props;
    return [
      <FormItem key="title" {...this.formLayout} label="标题">
        {form.getFieldDecorator('movie[title]', {
          rules: [{ required: true, message: '请输入标题！' }],
          initialValue: formVals.title,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="weight" {...this.formLayout} label="权重">
        {form.getFieldDecorator('movie[weight]', {
          rules: [{ required: true, message: '请输入权重！' }],
          initialValue: formVals.weight,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="time" {...this.formLayout} label="时长">
        {form.getFieldDecorator('movie[time]', {
          rules: [{ required: true, message: '请输入时长！' }],
          initialValue: formVals.time,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="id" {...this.formLayout} label={false}>
        {form.getFieldDecorator('movie[id]', {
          initialValue: formVals.id,
        })(<Input type="hidden" />)}
      </FormItem>,
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible, values } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext()}>
        保存
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values, errorMessage } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="修改视频"
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);
