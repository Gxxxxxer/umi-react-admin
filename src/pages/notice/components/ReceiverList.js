import React from 'react';
import { postRequest } from '@/utils/api';
import { ScreeningTag, OrdinaryTable, Search } from '@/components/BusinessComponent/BusCom';

import styles from './List.less';

import { PAY_LIST_SINGLE, SYS_Dict } from '@/services/SysInterface';

const search = {
  ordinary: {
    queryTitle: '姓名',
    queryField: 'fullName',
  },
  senior: [
    {
      queryTitle: '身份证号',
      queryField: 'idNumber',
      component: 'Input',
    },
    {
      queryTitle: '手机号',
      queryField: 'phoneNumber',
      component: 'Input',
    },
    {
      queryTitle: '户主',
      queryField: 'householderName',
      component: 'Input',
    },
    {
      queryTitle: '缴费标准',
      queryField: 'paymentStandard',
      component: 'Input',
    },
  ],
};

class ReceiverList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
    };
  }

  componentDidMount = async () => {
    const arr = [];
    const queueArr = await postRequest(`${SYS_Dict}/6`);
    if (queueArr.status === 200) {
      queueArr.data.forEach(item => {
        arr.push({
          text: item.dataLabel,
          value: item.id.toString(),
        });
      });
    }

    this.setState({
      columns: [
        {
          title: '序号',
          width: '6%',
          dataIndex: 'id',
          isIncrement: true,
        },
        {
          title: '大队',
          width: '8%',
          dataIndex: 'troops',
          column: 'troopsStr',
          filters: arr,
        },
        {
          title: '姓名',
          width: '8%',
          dataIndex: 'fullName',
        },
        {
          title: '身份证号',
          width: '14%',
          dataIndex: 'idNumber',
        },
        {
          title: '手机号',
          width: '8%',
          dataIndex: 'phoneNumber',
        },
        {
          title: '是否已读',
          width: '10%',
          dataIndex: 'paymentStandard',
        },
        {
          title: '确定状态',
          width: '14%',
          dataIndex: 'paymentDate',
        },
        {
          title: '确定时间',
          width: '8%',
          dataIndex: 'paymentMoney',
        },
      ],
    });
  };

  render() {
    return (
      <div className={styles.ListWrap}>
        <div className={styles.tableWrap}>
          <div className={styles.screenTag}>
            <Search ordinary={search.ordinary} senior={search.senior} />
            <ScreeningTag />
          </div>
          <div>
            <OrdinaryTable
              scroll={{
                x: 1000,
              }}
              listUrl={PAY_LIST_SINGLE}
              columns={this.state.columns}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ReceiverList;