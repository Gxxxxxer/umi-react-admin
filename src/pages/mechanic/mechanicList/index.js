import React from 'react';
import MemberDetail from './components/MemberDetail';
import { MECHANIC_HEAD, MECHANIC_LIST } from '@/services/FirstPartyInterface';
import {
  BaseTable,
  OrdinaryTable,
  TopStatistics,
  Info,
  Search,
  ExportButton,
} from '@/components/BusinessComponent/BusCom';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <BaseTable
          isTop={
            <TopStatistics
              sourceUrl={MECHANIC_HEAD}
              topJson={[
                {
                  displayTitle: '总计',
                  displayField: 'total',
                },
                {
                  displayTitle: '未审核',
                  displayField: 'wei',
                  queryTitle: '审核状态',
                  queryField: 'method',
                  queryValue: '1',
                },
                {
                  displayTitle: '已审核',
                  displayField: 'yi',
                  queryTitle: '审核状态',
                  queryField: 'method',
                  queryValue: '2',
                },
              ]}
            />
          }
          search={
            <Search
              ordinary={{
                queryTitle: '姓名',
                queryField: 'realName',
              }}
              senior={[
                {
                  queryTitle: '认证日期',
                  queryField: 'createDate',
                  component: 'RangePicker',
                },
                {
                  queryTitle: '认证手机号',
                  queryField: 'attestationPhone',
                  component: 'Input',
                },
                {
                  queryTitle: '身份证号',
                  queryField: 'idNumber',
                  component: 'Input',
                },
              ]}
              operationBlock={[
                <ExportButton
                  key="2"
                  exportUrl={MECHANIC_LIST}
                  columns={[
                    {
                      title: '序号',
                      column: 'id',
                    },
                    {
                      title: '姓名',
                      column: 'realName',
                    },
                    {
                      title: '性别',
                      column: 'genders',
                    },
                    {
                      title: '年龄',
                      column: 'age',
                    },
                    {
                      title: '审核状态',
                      column: 'attestationStateStr',
                    },
                    {
                      title: '身份证号',
                      column: 'idNumber',
                    },
                    {
                      title: '认证手机号',
                      column: 'attestationPhone',
                    },
                    {
                      title: '信用分数',
                      column: 'currentScore',
                    },
                    {
                      title: '认证时间',
                      column: 'createDate',
                    },
                  ]}
                />,
              ]}
            />
          }
          table={
            <OrdinaryTable
              scroll={{
                x: 1000,
                y: 'calc(100vh - 252px)',
              }}
              listUrl={MECHANIC_LIST}
              // isExport
              columns={[
                {
                  title: '序号',
                  width: '5%',
                  dataIndex: 'id',
                  isIncrement: true,
                },
                {
                  title: '姓名',
                  width: '10%',
                  dataIndex: 'realName',
                },
                {
                  title: '性别',
                  width: '5%',
                  dataIndex: 'genders',
                },
                {
                  title: '年龄',
                  width: '5%',
                  dataIndex: 'age',
                },
                {
                  title: '审核状态',
                  width: '10%',
                  dataIndex: 'attestationStateStr',
                  column: 'attestationStateStr',
                  filters: [
                    {
                      text: '未审核',
                      value: '1',
                    },
                    {
                      text: '已审核',
                      value: '2',
                    },
                  ],
                },
                {
                  title: '身份证号',
                  width: '20%',
                  dataIndex: 'idNumber',
                },
                {
                  title: '认证手机号',
                  width: '10%',
                  dataIndex: 'attestationPhone',
                },
                {
                  title: '信用分数',
                  width: '5%',
                  dataIndex: 'currentScore',
                },
                {
                  title: '认证时间',
                  width: '20%',
                  dataIndex: 'createDate',
                },
                {
                  title: '操作',
                  width: '10%',
                  dataIndex: 'opt',
                  render(text, record) {
                    return (
                      <div>
                        <Info title="技工信息详情" info={<MemberDetail id={record.id} />}>
                          详情
                        </Info>
                      </div>
                    );
                  },
                },
              ]}
            />
          }
        />
      </div>
    );
  }
}

export default Index;
