import {
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  message,
  Tag,
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { MovieItem, TableListPagination, TableListParams, MovieCreateParams } from './data.d';

import styles from './style.less';
import { truncateString } from '@/utils/utils';
import { Link } from 'umi';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<Action<'movies/add' | 'movies/fetch' | 'movies/remove' | 'movies/update'>>;
  loading: boolean;
  movies: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  selectedRows: MovieItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<MovieItem>;
  errorMessage?: string;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    movies,
    loading,
  }: {
    movies: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    movies,
    loading: loading.models.movies,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '编号',
      dataIndex: 'id',
      render: (id: number) => <Link to={`/admin/movies/${id}`}>{id}</Link>,
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (val: string, record: MovieItem) => (
        <Link to={`/admin/movies/${record.id}`}>{truncateString(val, 30)}</Link>
      ),
    },
    {
      title: '课程',
      dataIndex: 'playlist_name',
      render: (val: string) => truncateString(val, 30),
    },
    {
      title: '是否付费',
      dataIndex: 'is_paid',
      render: (val: boolean) => <Tag color={val ? 'green' : 'red'}>{val ? '是' : '否'}</Tag>,
    },
    {
      title: '发布时间',
      dataIndex: 'published_at',
    },
    {
      title: '操作',
      render: (_, record: MovieItem) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'movies/fetch',
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof MovieItem, string[]>,
    sorter: SorterResult<MovieItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      page: pagination.current,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'movies/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'movies/fetch',
      payload: {},
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'movies/remove',
          payload: {
            id: selectedRows.map(row => row.id),
          },
          callback: (msg?: string) => {
            if (msg) {
              message.error(msg);
            } else {
              dispatch({ type: 'movies/fetch' });
              this.setState({
                selectedRows: [],
              });
              message.success('删除成功');
            }
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: MovieItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        q: {
          ...fieldsValue.q,
          published_at_eq:
            fieldsValue.q.published_at_eq && fieldsValue.q.published_at_eq.format('YYYY-MM-DD'),
        },
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'movies/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValueType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = (fields: MovieCreateParams, cb: () => void) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'movies/add',
      payload: {
        ...fields,
      },
      callback: (msg?: string) => {
        if (msg) {
          this.setState({
            errorMessage: msg,
          });
        } else {
          cb();
          message.success('添加成功');
          this.handleModalVisible();
        }
      },
    });
  };

  handleUpdate = (fields: FormValueType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'movies/update',
      payload: {
        ...fields,
      },
      callback: (msg?: string) => {
        if (msg) {
          this.setState({
            errorMessage: msg,
          });
        } else {
          message.success('修改成功');
          this.handleUpdateModalVisible();
        }
      },
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('q[title_cont]')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="发布日期">
              {getFieldDecorator('q[published_at_eq]')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入发布日期" />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      movies: { data },
      loading,
    } = this.props;

    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      errorMessage,
    } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm errorMessage={errorMessage} {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            errorMessage={errorMessage}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
