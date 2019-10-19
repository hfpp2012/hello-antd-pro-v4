import { Form, Input, Modal, Alert, Select } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useEffect, useState } from 'react';
import { MovieCreateParams } from '../data';
import request from '@/utils/request';

const FormItem = Form.Item;

const { TextArea } = Input;

const { Option } = Select;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: MovieCreateParams, cb: () => void) => void;
  handleModalVisible: () => void;
  errorMessage?: string;
}

interface PlaylistsData {
  id: number;
  name: string;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const [playlists, setPlaylists] = useState<PlaylistsData[]>([]);
  useEffect(() => {
    async function getPlaylists() {
      const response = await request('/movies/playlist');
      setPlaylists(response.response.playlists);
    }
    getPlaylists();
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
          rules: [{ required: true, message: '请输入标题！' }],
        })(<Input placeholder="请输入标题" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="时长">
        {form.getFieldDecorator('movie[time]', {
          rules: [{ required: true, message: '请输入时长！' }],
        })(<Input placeholder="请输入时长" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="播放地址">
        {form.getFieldDecorator('movie[mp4_url]', {
          rules: [{ required: true, message: '请输入播放地址！' }],
        })(<Input placeholder="请输入播放地址" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        {form.getFieldDecorator('movie[body]', {
          rules: [{ required: true, message: '请输入内容！' }],
        })(<TextArea rows={4} placeholder="请输入内容" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="课程">
        {form.getFieldDecorator('movie[playlist_id]', {
          rules: [{ required: true, message: '请选择课程！' }],
        })(
          <Select placeholder="请选择课程" style={{ width: '100%' }}>
            {playlists.map(playlist => (
              <Option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </Option>
            ))}
          </Select>,
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
