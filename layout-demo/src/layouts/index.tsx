import React from 'react';
import ProLayout, { PageHeaderWrapper } from '@ant-design/pro-layout';
import logo from '@/assets/yay.jpg';

const BasicLayout: React.FC = props => {
  return (
    <ProLayout title="qiuzhi99" navTheme="light" logo={logo}>
      <PageHeaderWrapper content="xxx" />
      {props.children}
    </ProLayout>
  );
};

export default BasicLayout;
