import { Card, Descriptions } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { connect } from 'dva';
import { MovieData } from './data';

interface IProps {
  loading: boolean;
  dispatch: Dispatch<any>;
  movieShow: MovieData;
  match: any;
}
interface IState {
  visible: boolean;
}

@connect(
  ({
    movieShow,
    loading,
  }: {
    movieShow: MovieData;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    movieShow,
    loading: loading.effects['movieShow/fetch'],
  }),
)
class Basic extends Component<IProps, IState> {
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'movieShow/fetch',
      payload: { id: match.params.id },
    });
  }

  render() {
    const {
      movieShow: { movie },
    } = this.props;
    return (
      <Descriptions.Item>
        {!!movie && (
          <Card bordered={false}>
            <Descriptions title={`${movie.title}`} style={{ marginBottom: 32 }}>
              <Descriptions.Item label="id">{movie.id}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{movie.published_at}</Descriptions.Item>
              <Descriptions.Item label="时长">{movie.time}</Descriptions.Item>
              <Descriptions.Item label="所属课程">{movie.playlist_name}</Descriptions.Item>
              <Descriptions.Item label="是否付费">{movie.is_paid ? '是' : '否'}</Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Descriptions.Item>
    );
  }
}

export default Basic;
