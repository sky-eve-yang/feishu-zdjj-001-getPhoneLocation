"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
// 通过addDomainList添加请求接口的域名
block_basekit_server_api_1.basekit.addDomainList(['cx.shouji.360.cn']);
block_basekit_server_api_1.basekit.addField({
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
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                placeholder: t('placeholderPhone'),
                supportType: [block_basekit_server_api_1.FieldType.Number, block_basekit_server_api_1.FieldType.Text],
            },
            validator: {
                required: true,
            }
        },
    ],
    // 定义捷径的返回结果类型
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: {
                light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/abjayvoz/ljhwZthlaukjlkulzlp/2024q3/telephone.svg?x-resource-account=public',
            },
            properties: [
                {
                    key: 'id',
                    isGroupByKey: true,
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: 'id',
                    hidden: true,
                },
                {
                    key: 'province',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: t('province'),
                    primary: true
                },
                {
                    key: 'city',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: t('city')
                },
                {
                    key: 'sp',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: t('sp')
                }
            ],
        },
    },
    execute: async (formItemParams, context) => {
        const { phone = '' } = formItemParams;
        let phone_number;
        // 判断一：文本类型 or 数字类型
        if (typeof phone == 'object' && phone !== null) {
            // 判断二：非 NaN 数字
            if (Number.isNaN(parseInt(phone[0]?.text)) || parseInt(phone[0]?.text) == 0)
                return {
                    code: block_basekit_server_api_1.FieldCode.InvalidArgument,
                    msg: '手机号码格式错误',
                };
            phone_number = parseInt(phone[0]?.text);
        }
        else {
            phone_number = phone;
        }
        console.log("phone_number", phone_number);
        // 判断三：正则格式校验
        if (!/^1[3-9]\d{9}$/.test(String(phone_number))) {
            console.log(String(phone_number));
            return {
                code: block_basekit_server_api_1.FieldCode.InvalidArgument,
                msg: '手机号码格式错误，请输入 11 位合法国内手机号码',
            };
        }
        try {
            const res = await context.fetch(`https://cx.shouji.360.cn/phonearea.php?number=${phone_number}`, {
                method: 'GET',
            }).then(res => res.json());
            const posiInfo = res?.data;
            console.log("posiInfo", posiInfo);
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    id: `${Math.random()}`,
                    province: posiInfo.province,
                    sp: posiInfo.sp,
                    city: posiInfo.city
                }
            };
        }
        catch (e) {
            return {
                code: block_basekit_server_api_1.FieldCode.InvalidArgument,
                msg: e
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBZ0o7QUFDaEosTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsMkJBQTJCO0FBQzNCLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0FBRTVDLGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2YsZ0JBQWdCO0lBQ2hCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxPQUFPLEVBQUUsS0FBSztnQkFDZCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsTUFBTSxFQUFFLElBQUk7Z0JBQ1osSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsa0JBQWtCLEVBQUUsa0JBQWtCO2FBQ3ZDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixVQUFVLEVBQUUsVUFBVTtnQkFDdEIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsSUFBSSxFQUFFLGtCQUFrQjtnQkFDeEIsa0JBQWtCLEVBQUUsbUVBQW1FO2FBQ3hGO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxNQUFNO2dCQUNmLFVBQVUsRUFBRSxNQUFNO2dCQUNsQixNQUFNLEVBQUUsR0FBRztnQkFDWCxJQUFJLEVBQUUsT0FBTztnQkFDYixrQkFBa0IsRUFBRSwyQkFBMkI7YUFDaEQ7U0FDRjtLQUNGO0lBQ0QsVUFBVTtJQUNWLFNBQVMsRUFBRTtRQUNUO1lBQ0UsR0FBRyxFQUFFLE9BQU87WUFDWixLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNqQixTQUFTLEVBQUUseUNBQWMsQ0FBQyxXQUFXO1lBRXJDLEtBQUssRUFBRTtnQkFDTCxXQUFXLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDO2dCQUNsQyxXQUFXLEVBQUUsQ0FBQyxv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