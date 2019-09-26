import { Button, Form, Input, Modal, Alert } from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data.d';

export interface FormValueType extends Partial<TableListItem> {
  title?: string;
  time?: string;
  weight?: number;
  id?: number;
}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: FormValueType) => void;
  handleUpdate: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
  errorMessage: string | null;
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
        time: props.values.time,
        id: props.values.id,
        weight: props.values.weight,
      },
    };
  }

  handleSubmit = () => {
    const { form, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...fieldsValue };
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
      <FormItem key="name" {...this.formLayout} label="标题">
        {form.getFieldDecorator('movie[title]', {
          rules: [{ required: true, message: '请输入标题！' }],
          initialValue: formVals.title,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="time" {...this.formLayout} label="时长">
        {form.getFieldDecorator('movie[time]', {
          rules: [{ required: true, message: '请输入时长！' }],
          initialValue: formVals.time,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="weight" {...this.formLayout} label="权重">
        {form.getFieldDecorator('movie[weight]', {
          rules: [{ required: true, message: '请输入权重！' }],
          initialValue: formVals.weight,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="id" {...this.formLayout} label={false}>
        {form.getFieldDecorator('movie[id]', {
          initialValue: formVals.id,
        })(<Input type="hidden" placeholder="请输入" />)}
      </FormItem>,
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible, values } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={() => this.handleSubmit()}>
        完成
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
        title="编辑视频"
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {errorMessage === null ? null : <Alert message={errorMessage} type="error" showIcon />}
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);
