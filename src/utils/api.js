/* eslint-disable import/no-extraneous-dependencies */
import router from 'umi/router';
import moment from 'moment';
import request from './request';

export const http = process.env.apiUrl;
export const ws = `${process.env.wsUrl}/websocket`;

export function getRequest(url) {
  return new Promise((resolve, reject) => {
    let headers = {};
    if (localStorage.getItem('Authorization')) {
      headers = { Authorization: localStorage.getItem('Authorization') };
    }
    request(http + url, {
      method: 'GET',
      headers,
    })
      .then(response => {
        const resultData = response;
        resolve(resultData);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function postRequest(url, params) {
  return new Promise((resolve, reject) => {
    let headers = {};
    if (localStorage.getItem('Authorization') && url !== '/system/verificationUser') {
      headers = { Authorization: localStorage.getItem('Authorization') };
    }
    request(http + url, {
      method: 'POST',
      headers,
      body: {
        ...params,
      },
    })
      .then(response => {
        const resultData = response;
        if (typeof resultData !== 'undefined') {
          if (resultData.status === 120) {
            router.push('/user/login');
          } else {
            resolve(resultData);
          }
        } else {
          resolve(resultData);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function putRequest(url, params) {
  return new Promise((resolve, reject) => {
    request(http + url, {
      method: 'PUT',
      body: {
        ...params,
      },
    })
      .then(response => {
        const resultData = response;
        resolve(resultData);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function deleteRequest(url) {
  return new Promise((resolve, reject) => {
    let headers = {};
    if (localStorage.getItem('Authorization')) {
      headers = { Authorization: localStorage.getItem('Authorization') };
    }
    request(http + url, {
      method: 'delete',
      headers,
    })
      .then(response => {
        const resultData = response;
        resolve(resultData);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function postFormDateRequest(url, params) {
  let headers = {};
  if (localStorage.getItem('Authorization')) {
    headers = { Authorization: localStorage.getItem('Authorization') };
  }
  let paramstr = '';
  for (const key in params) {
    if (key) {
      paramstr = `${paramstr + key}=${params[key]}&`;
    }
  }
  if (paramstr !== '') {
    paramstr = paramstr.substr(0, paramstr.length - 1);
  }
  return new Promise((resolve, reject) => {
    request(http + url, {
      method: 'POST',
      headers,
      body: paramstr,
    })
      .then(response => {
        const resultData = response;
        if (typeof resultData !== 'undefined') {
          resolve(resultData);
        } else {
          resolve(resultData);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * 导出export
 */
let current1 = 0;

export async function exportExcel(url, params) {
  // Object.assign(params, { type: 1 });
  current1 += 1;
  Object.assign(params, {
    pagination: {
      current: current1,
      pageSize: 5000,
    },
  });
  const data = await postRequest(url, params);
  if (data.status === 200) {
    window.location.href = `${http}/file/excel?Authorization=${localStorage.getItem(
      'Authorization'
    )}`;
    if (data.data.lastPage !== 0 && data.data.lastPage.toString() !== current1.toString()) {
      exportExcel(url, params);
    } else {
      current1 = 0;
    }
  }
}

/* eslint-disable */
/**
 * 参数处理方法
 * @param json
 */
export function jsonString(json) {
  for (const key in json) {
    if (Array.isArray(json[key])) {
      if (key.indexOf('Date') >= 0 || key.indexOf('Time') >= 0) {
        let arr = [];
        json[key].forEach(str => {
          arr.push(moment(str).format('YYYY-MM-DD'));
        });
        json[key] = arr;
      } else {
        let kg = false;
        json[key].forEach((json2, i) => {
          if (typeof json2 === 'object') {
            jsonString(json2);
          } else if (typeof json2 !== 'undefined') {
            json2 = json2.toString();
            kg = true;
          }
        });
        if (kg) {
          json[key] = json[key].toString();
        }
      }
      if (json[key].length <= 0) {
        json[key] = null;
      }
    } else {
      if (
        json[key] !== null &&
        typeof json[key] !== 'undefined' &&
        typeof json[key] !== '' &&
        (key.indexOf('Date') >= 0 || key.indexOf('Time') >= 0)
      ) {
        json[key] = moment(json[key]).format('YYYY-MM-DD');
      }
    }
  }
}

export function requestParameterProcessing(json) {
  for (const key in json) {
    if (Array.isArray(json[key])) {
      let arr = [];
      let type = 0; // 数据类型 0 字符 1 日期 2 上传 3 对象
      json[key].forEach(obj => {
        if (moment.isMoment(obj)) {
          // 日期处理
          type = 1;
          arr.push(obj.format('YYYY-MM-DD'));
        } else if (moment.isDate(obj)) {
          type = 1;
          arr.push(moment(obj).format('YYYY-MM-DD'));
        } else if (obj.url && obj.uid && obj.name && obj.status) {
          // 上传处理
          type = 2;
          arr.push(obj.url);
        } else if (typeof obj === 'object') {
          type = 3;
          requestParameterProcessing(obj);
          arr.push(obj);
        } else {
          type = 0;
          arr.push(obj);
        }
      });
      if (type === 2) {
        json[key] = arr.join('#');
      } else if (type === 1) {
        json[key] = arr;
      } else if (type === 0) {
        json[key] = arr.toString();
      } else {
        json[key] = arr;
      }
    } else if (typeof json[key] === 'object') {
      if (moment.isMoment(json[key])) {
        // 日期处理
        json[key] = json[key].format('YYYY-MM-DD');
      } else if (moment.isDate(json[key])) {
        json[key] = moment(json[key]).format('YYYY-MM-DD');
      } else {
        requestParameterProcessing(json[key]);
      }
    }
  }
}

function exportExcelGet(url, params) {
  window.open(`${http}/upload/excel?list=${params}`);
}

/**
 * 验证非空
 */
export function verVal(val) {
  return val !== '' && typeof val !== 'undefined' && val !== null;
}

/**
 * 验证身份证
 */

export function IdentityCodeValid(code) {
  var city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 ',
  };
  var tip = '';
  var pass = true;
  //验证身份证格式（6个地区编码，8位出生日期，3位顺序号，1位校验位）
  if (
    !code ||
    !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)
  ) {
    tip = '身份证号格式错误';
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = '地址编码错误';
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if (parity[sum % 11] != code[17]) {
        tip = '校验位错误';
        pass = false;
      }
    }
  }
  console.log(tip);
  return pass;
}

export function isCardNo(card) {
  const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return pattern.test(card);
}
