import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType } from '@lark-opdev/block-basekit-server-api';
const { t } = field;

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(['cx.shouji.360.cn']);

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        'phone': '手机号',
        'province': '省份',
        'city': '城市',
        'sp': '运营商',
        "placeholderPhone": "请选择手机号对应的文本或数字字段"
      },
      'en-US': {
        'phone': 'Phone Number',
        'province': 'Province',
        'city': 'City',
        'sp': 'Service Provider',
        'placeholderPhone': 'Please select the numeric field corresponding to the phone number'   
      },
      'ja-JP': {
        'phone': '携帯番号',
        'province': '都道府県',
        'city': '市',
        'sp': '通信事業者',
        'placeholderPhone': '携帯番号に対応する数字フィールドを選択してください'
      },
    }
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'phone',
      label: t('phone'),
      component: FieldComponent.FieldSelect,
      
      props: {
        placeholder: t('placeholderPhone'),
        supportType: [FieldType.Number, FieldType.Text],

      },
      validator: {
        required: true,
      }
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/abjayvoz/ljhwZthlaukjlkulzlp/2024q3/telephone.svg?x-resource-account=public',
      },
      properties: [
        {
          key: 'id',
          isGroupByKey: true,
          type: FieldType.Text,
          title: 'id',
          hidden: true,
        },
        {
          key: 'province',
          type: FieldType.Text,
          title: t('province'),
          primary: true
        },
        {
          key: 'city',
          type: FieldType.Text,
          title: t('city')
        },
        {
          key: 'sp',
          type: FieldType.Text,
          title: t('sp')
        }
      ],
    },
  },
  execute: async (formItemParams: { phone: number | object }, context) => {
    const { phone = '' } = formItemParams;
    let phone_number
    // 判断一：文本类型 or 数字类型
    if (typeof phone == 'object' && phone !== null) {
      // 判断二：非 NaN 数字
      if ( Number.isNaN(parseInt(phone[0]?.text)) || parseInt(phone[0]?.text) == 0 ) 
        return {
          code: FieldCode.InvalidArgument,
          msg: '手机号码格式错误',
        };
      phone_number = parseInt(phone[0]?.text)
    } else {
      phone_number = phone
    }
    console.log("phone_number", phone_number)

    // 判断三：正则格式校验
    if (!/^1[3-9]\d{9}$/.test(String(phone_number))) {
      console.log(String(phone_number))
      return {
        code: FieldCode.InvalidArgument,
        msg: '手机号码格式错误，请输入 11 位合法国内手机号码',
      };
    }

    try {
      const res = await context.fetch(`https://cx.shouji.360.cn/phonearea.php?number=${phone_number}`, { // 已经在addDomainList中添加为白名单的请求
        method: 'GET',
      }).then(res => res.json());
      const posiInfo = res?.data;
      console.log("posiInfo", posiInfo)
      return {
        code: FieldCode.Success,
        data: {
          id: `${Math.random()}`,
          province: posiInfo.province,
          sp: posiInfo.sp,
          city: posiInfo.city
        }
      }
    } catch (e) {
      return {
        code: FieldCode.InvalidArgument,
        msg: e
      }
    }
  },
});
export default basekit;