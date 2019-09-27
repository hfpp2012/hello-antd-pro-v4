import { Form, Input, Modal, Alert, Select } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useEffect, useState } from 'react';
import { createMovieParms, PlaylistData } from '../data.d';
import request from '@/utils/request';
const { Option } = Select;

const FormItem = Form.Item;

const { TextArea } = Input;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: createMovieParms, cb: () => void) => void;
  handleModalVisible: () => void;
  errorMessage?: string;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  useEffect(() => {
    async function fetchPlaylist() {
      const response = await request(`/movies/playlist`);
      setPlaylists(response.response.playlists);
    }
    fetchPlaylist();
  }, []);

  const { modalVisible, form, handleAdd, handleModalVisible, errorMessage } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => {
        form.resetFields();
      });
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建视频"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        {form.getFieldDecorator('movie[title]', {
          rules: [{ required: true, message: '必须填写标题', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="时长">
        {form.getFieldDecorator('movie[time]', {
          rules: [{ required: true, message: '必须填写时长' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="mp4播放地址">
        {form.getFieldDecorator('movie[mp4_url]', {
          rules: [{ required: true, message: '必须填写播放地址' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        {form.getFieldDecorator('movie[body]', {
          rules: [{ required: true, message: '必须填写内容', min: 5 }],
        })(<TextArea rows={4} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="课程">
        {form.getFieldDecorator('movie[playlist_id]', {
          rules: [{ required: true, message: '必须选择' }],
        })(
          <Select placeholder="Please select" style={{ width: '100%' }}>
            {playlists.map(playlist => (
              <Option key={playlist!.id} value={playlist!.id}>
                {playlist!.name}
              </Option>
            ))}
          </Select>,
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
