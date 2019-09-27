import { Card, Descriptions } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType } from './model';

interface BasicProps {
  loading: boolean;
  dispatch: Dispatch<any>;
  movieShow: StateType;
  match: any;
}
interface BasicState {}

@connect(
  ({
    movieShow,
    loading,
  }: {
    movieShow: StateType;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    movieShow,
    loading: loading.effects['movieShow/fetch'],
  }),
)
class Basic extends Component<BasicProps, BasicState> {
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'movieShow/fetch',
      payload: {
        id: match.params.id,
      },
    });
  }

  render() {
    const { movieShow } = this.props;
    const { movie } = movieShow;
    return (
      <PageHeaderWrapper>
        {movie !== null && (
          <Card bordered={false}>
            <Descriptions title="视频详情" style={{ marginBottom: 32 }}>
              <Descriptions.Item label="标题">{movie.title}</Descriptions.Item>
              <Descriptions.Item label="是否付费">{movie.is_paid ? '是' : '否'}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{movie.published_at}</Descriptions.Item>
              <Descriptions.Item label="所属课程">{movie.playlist_name}</Descriptions.Item>
              <Descriptions.Item label="时长">{movie.time}</Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Basic;
