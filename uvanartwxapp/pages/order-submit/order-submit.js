// pages/order-submit/order-submit.js
import regeneratorRuntime from '../../utils/API/wxPromise.min.js'
const Decimal = require('../../utils/decimal.js');
const Url = require('../../utils/API/url.js');
var api = require("../../utils/API/request.js");
var common = require("../../utils/common.js");
import { GetNearbyStores, getmyvanbeannum, designgold, MeetConditionsCoupons, CalcuDiscount, Buy, PaySuccess } from "../../utils/API/order-submit/api.js"

var token = '';
var phone = '';
const {getMyAddress, getFreightByArea, createOrder, getWxpaydata, modifyOrderStatus} = require('../../utils/HttpUtils.js');

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器
var count = 5;
var page = 1;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        enabledPay: true,
        orderId: '',
        deliveryMethods: [
            '送货上门并安装',
            '自提',
        ],
        payModes: [
            '线上支付',
            '线下支付',
        ],
        detailId: '', //用于跳转到订单详情页
        payStatus: '', //线上支付A，线下支付B，梵豆支付C
        selectedDeliveryMethod: '',
        selectPayModes: '',
        F_ID: '', //提交订单传给后台
        list: [],
        goodsList: [], //分销价商品
        consignee: {
            // address: "考虑控",
            // city: "北京市",
            // county: "东城区",
            // customer_name: "奖励金",
            // id: "ec95328d-16c9-44af-88a0-65eedc2f6690",
            // is_default: true,
            // label: "学校",
            // openid: "oQCP70NbObeVQvel-a7sXMFhVAlk",
            // phone: "13215257146",
            // province: "北京市",
        },
        freight: 0,
        freightDecimal2: '0.00',
        allProductsAmount: 0,
        allProductsAmountDecimal2: '0.00',
        totalPrice: 0,
        totalPriceDecimal2: '0.00',
        allProductsCount: 0,
        beanPay: false,
        beanCount: 0,
        discountWinHeight: 80, //控制优惠块的高度
        discountinputTop: -80, //控制优惠输入框的显隐
        showdiscountinput: false, //是否渲染优惠输入框
        discountCode: '', //优惠码
        discountMoney: '', //优惠金额
        comfirmCode: false, //确认优惠码
        comfirmCoupons: false, //确认优惠券
        hasComfirm: false, //优惠码确认防误触
        theRealPrice: 0.00, // 最终价格
        codeState: '', //优惠码状态
        F_RealPayAmount: 0, //传到微信支付的金额
        showDeliveryCycle: true, //拼团不显示发货周期
        productCategories: '', //判断是否拼团订单
        payMoney: 0, //需要支付的金额
        tradeNo: '', //需要返回给后台的订单号
        GroupBuyOrderID: '', //团ID
        CreateDate: '', //下单时间
        canTapPay: true, //防止多次点击付款
        longitude: 0, //经度
        latitude: 0, //纬度
        storeName: '', //附近门店
        storeid: '', //附近门店ID
        hiddenCouponsBounced: true, //隐藏优惠券弹框
        showMore: true,
        checked: false, //已经中优惠券
        windowHeight: '', //屏幕可用高度
        couponNum: '-1', //优惠券编号，默认-1
        dataList: ['￥500，商品金额满3000可用', '￥500，商品金额满3000可用', '￥500，商品金额满3000可用'],
        onlyOneCouponNum: false, //只有一张优惠券情况
        couponList: [], //优惠券列表
        onCoupons: false, //没有优惠券
        page: '', //优惠券页码
        checkedNoUseCoupon: false, //暂不使用优惠券是否选中
        couponsText: '优惠',
        goodsamountfull: '', //满减金额
        customerState: false, //判断用户是否为分销用户
        F_OrderType: 'A', //订单类型(A-普通订单;B-拼团订单;C-分销订单;)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        console.log(JSON.parse(options.list))
        //获取经纬度
        const _this = this
        let paystate = options.beanPay
        let goodsList = JSON.parse(options.list)
        // 判断是否为分销客户
        this.checkCustomer(goodsList);

        if (options.productCategories) {
            if (options.productCategories == '拼团') {
                this.setData({
                    productCategories: '拼团',
                    showDeliveryCycle: false,
                    payModes: ['线上支付']
                })
            }
        }
        if (options.beanPay == true) {
            this.setData({
                payModes: ['梵豆支付'],
                deliveryMethods: ['普通配送'],
                selectedDeliveryMethod: '普通配送',
            })
        }
        console.log("options:" + options.beanPay)
        /*获取可用梵豆数量*/
        token = wx.getStorageSync("token");
        phone = wx.getStorageSync("phone");
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                _this.setData({
                    longitude: res.longitude,
                    latitude: res.latitude
                })
                console.log(res)
                console.log('经纬度===========================================')
                let locationData = {
                    "token": token,
                    'loginMark': phone,
                    'longitude': _this.data.longitude,
                    'latitude': _this.data.latitude
                }
                // api.get('/s2b/physicalstore/GetNearbyStores', locationData)
                GetNearbyStores(locationData)
                    .then(res => {
                        console.log(res.data.storeName)
                        if (res.code == 200) {
                            let storeName = res.data.storeName
                            if (storeName == '' || storeName == null) {
                                _this.setData({
                                    storeName: '无附近门店',
                                    storeid: res.data.storeId
                                })
                            } else {
                                _this.setData({
                                    storeName,
                                    storeid: res.data.storeId
                                })
                            }

                        }
                        console.log('距离==============================================')
                    })
            }
        })
        var beanData = {
            "token": token,
            "loginMark": phone
        }
        // api.get('/lr/s2bapi/getmyvanbeannum', beanData)
        getmyvanbeannum(beanData)
            .then(res => {
                console.log(res.data.Data)
                this.setData({
                    beanCount: res.data.Data
                })
            })
        if (options.beanPay == "有梵豆商品") {
            this.setData({
                beanPay: true,
                selectPayModes: '梵豆支付',
                payStatus: 'C'
            })
        } else {
            this.setData({
                beanPay: false,
                selectPayModes: '线上支付',
                payStatus: 'A'
            })
        }
        // const list = JSON.parse(options.list);
        // console.log(list);
        // console.log('list=============================');
        // this.setData({
        //   list,
        // });
        // this.computeProductsCountAndAmount();

        this.fetchMyAddress();

    },

    checkCustomer: async function(goodsList) {
        var _this = this
        wx.showLoading({
            title: '加载中...',
        })
        try {
            let result = await this.isdistributioncustomer(goodsList);
            console.log('结果' + result)
            if (result) {
                //  是分销客户
                _this.setData({
                    F_OrderType: 'C'
                })
                this.ueryskudistributionprice(goodsList); //查询分销价格
            } else {
                //  不是分销客户
                this.setData({
                    list: goodsList,
                    F_OrderType: 'A'
                })
                this.computeProductsCountAndAmount();
            }
        } catch ( e ) {
            console.log(e)
        }
    },

    //判断是否是分销客户
    isdistributioncustomer: function(goodsList) {
        var _this = this;
        return new Promise((resolve, reject) => {
            api.get('/s2b/distribution/isdistributioncustomer').then(res => {
                console.log(res)
                if (res.code == 200) {
                    _this.setData({
                        customerState: res.data.result
                    })
                    resolve(res.data.result)
                } else {
                    wx.showToast({
                        title: '客户验证失败',
                        icon: 'none'
                    })
                    _this.setData({
                        list: goodsList
                    })
                    _this.computeProductsCountAndAmount();
                }
            })
        })
    },

    // 查询商品分销价
    ueryskudistributionprice: function(goodsList) {
        var _this = this;
        return new Promise((resolve, reject) => {
            console.log('分销价格=======================================')
            console.log(goodsList)
            var skuList = [];
            goodsList.forEach((value, index, array) => { //获取商品sku
                skuList.push(array[index].sku)
            })
          let str = skuList.join(',')
          let queryUrl = '/s2b/distribution/queryskudistributionprice?data=' + encodeURIComponent(str);
          console.log(encodeURI(queryUrl))
            console.log(_this.data.selectPayModes)
            api.get(queryUrl).then(res => {
                console.log(res)
                if (res.code == 200) {
                    console.log(res.data.skuDistPriceResponses)
                    for (var i = 0; i < res.data.skuDistPriceResponses.length; i++) {
                        goodsList.forEach((value, index, array) => {
                            if (array[index].sku == res.data.skuDistPriceResponses[i].sku) {
                                array[index].priceDecimal2 = _this.data.selectPayModes == '梵豆支付' ? Math.floor(res.data.skuDistPriceResponses[i].distribution_price) : res.data.skuDistPriceResponses[i].distribution_price
                                array[index].product_price = _this.data.selectPayModes == '梵豆支付' ? Math.floor(res.data.skuDistPriceResponses[i].distribution_price) : res.data.skuDistPriceResponses[i].distribution_price
                            }
                        })
                    }
                    _this.setData({
                        list: goodsList,
                        F_ID: res.data.key
                    })
                    console.log('分销价格计算好了=================================')
                    console.log(_this.data.list)
                    _this.computeProductsCountAndAmount();
                } else {
                    // wx.showToast({
                    //   title: '获取分销价失败',
                    //   icon: 'none'
                    // })
                    console.log('获取分销价失败')
                    _this.setData({
                        list: goodsList
                    })
                    _this.computeProductsCountAndAmount();
                }
                wx.hideLoading()
            })
            console.log(skuList)
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(options) {
        //开始计时（停留时间）
        stayTime_JY = 0 //停留时间
        stayTimer_JY = setInterval(() => {
            stayTime_JY++
        }, 1000)

        if (this.data.productCategories == '拼团') {
            this.setData({
                productCategories: '拼团',
                showDeliveryCycle: false,
                payModes: ['线上支付']
            })
        } else if (this.data.beanPay) {
            this.setData({
                payModes: ['梵豆支付'],
                deliveryMethods: ['普通配送'],
                selectedDeliveryMethod: '普通配送',
            })
        } else {
            this.setData({
                deliveryMethods: [
                    '送货上门并安装',
                    '自提',
                ],
            });
        }

        if (this.data.selectPayModes != "梵豆支付") {
            this.fetchFreightByArea();
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        //离开时插入访问记录
        clearInterval(stayTimer_JY)
        common.visitorRecordAPI(stayTime_JY, "确认订单（结算）")
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        //离开时插入访问记录
        clearInterval(stayTimer_JY)
        common.visitorRecordAPI(stayTime_JY, "确认订单（结算）")
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    // 两位小数点
    toDecimal2: function(v) {
        let f = parseFloat(v);
        if (isNaN(f)) {
            return "0.00";
        } else {
            // return f.toFixed(2);
            return new Decimal(v).toFixed(2);
        }
    },

    computeProductsCountAndAmount: function() {
        console.log('检测价格=======================')
        console.log(this.data.list)
        let list = this.data.list || [];
        let amount = 0;
        let count = 0;
        list.map(function(product, index) {
            count += product.count || 1;
            amount = new Decimal(product.product_price).times(product.count || 1).plus(amount);
        });

        const totalPrice = new Decimal(this.data.freight || 0).plus(amount);
        console.log(this.toDecimal2(totalPrice))
        debugger
        this.setData({
            freightDecimal2: this.toDecimal2(this.data.freight),
            allProductsAmount: amount,
            allProductsAmountDecimal2: this.toDecimal2(amount),
            totalPrice: totalPrice,
            totalPriceDecimal2: this.toDecimal2(totalPrice),
            allProductsCount: count,
        });
        console.log(this.data.totalPriceDecimal2)
        // 重新计算
        if (!!this.data.discountCode && !!this.data.goodsamountfull) { //优惠码不为空
            debugger
            // goodsamountfull
            if (this.toDecimal2(amount) < this.data.goodsamountfull) {
                debugger
                wx.showToast({
                    title: '不享受优惠',
                    icon: 'none'
                })
                console.log(this.toDecimal2(amount))
                this.setData({
                    totalPriceDecimal2: this.toDecimal2(amount),
                    codeState: '',
                    couponNum: '-1', //重置
                })
                this.giveupCode()
            } else {
                let mark = 3
                debugger
                this.discountMethod(mark);
            }
        }
    },

    // 修改商品时触发
    onChangeProducts: function(list = []) {
        this.setData({
            list,
        });
        this.computeProductsCountAndAmount();
        if (this.data.selectPayModes != "梵豆支付") {
            this.fetchFreightByArea();
        }
    },

    doNothing: function(e) {},

    bindfocus: function(e) {},

    bindblur: function(e) {
        const {value} = e.detail;

        if (value == '') {
            const dataset = e.currentTarget.dataset || {};
            const {index = 0} = dataset;
            let list = this.data.list || [];
            let product = list[index] || {};
            // product.count = 1;

            list[index] = product;
            this.onChangeProducts(list);
        }
    },

    bindinput: function(e) {
        const {value} = e.detail;
        const dataset = e.currentTarget.dataset || {};
        const {index = 0} = dataset;
        let list = this.data.list || [];
        let product = list[index] || {};

        if (value == '' || /^([1-9][0-9]{0,2})?$/.test(value.substr(0, 3))) {
            if (value == '') {
                // product.count = 1;
                // list[index] = product;
                // this.setData({
                //   list,
                // });
                // this.computeProductsCountAndAmount();
                return value;
            } else {
                product.count = value.substr(0, 3);
                list[index] = product;
                // this.setData({
                //   list,
                // });
                // this.computeProductsCountAndAmount();
                this.onChangeProducts(list);
                return value.substr(0, 3);
            }
        } else {
            return `${product.count}`;
        }

    },

    // 减
    handleDecrease: function(e) {
        const dataset = e.currentTarget.dataset || {};
        const {index = 0} = dataset;

        let list = this.data.list || [];

        let product = list[index] || {};
        if (+product.count <= 1) {
            return;
        }

        product.count = +product.count - 1;
        list[index] = product;

        // this.setData({
        //   list,
        // });
        // this.computeProductsCountAndAmount();
        this.onChangeProducts(list);
    },

    // 加
    handleIncrease: function(e) {
        const dataset = e.currentTarget.dataset || {};
        const {index = 0} = dataset;

        let list = this.data.list || [];

        let product = list[index] || {};
        if (+product.count >= 999) {
            return;
        }

        product.count = +product.count + 1;
        list[index] = product;

        // this.setData({
        //   list,
        // });
        // this.computeProductsCountAndAmount();
        this.onChangeProducts(list);
    },

    // 跳转地址选择器
    handleToSelectedAddress: function(e) {
        // TODO:
        console.warn('TODO: 跳转地址选择器');
        wx.navigateTo({
            url: '/pages/me/personal/address/address',
        });
    },

    // 获取我的收获地址
    fetchMyAddress: function() {
        wx.showLoading({
            title: '加载中...',
            mask: true,
        });
        let that = this;
        getMyAddress({
            success: function(res) {
                console.log(res);
                if (res.data.code == 200) {
                    if (res.data.data.length > 0) {
                        const idx = res.data.data.findIndex(function(item, index) {
                            return item.is_default == true;
                        });
                        console.log(idx);
                        let consignee = {};
                        if (idx > -1) {
                            consignee = res.data.data[idx] || {};
                            console.log(consignee)
                            console.log('默认地址==========================')
                        } else {
                            consignee = res.data.data[0] || {};
                        }
                        switch (consignee.province) {
                        case '北京市':
                            consignee.province = '北京'
                            break;
                        case '重庆市':
                            consignee.province = '重庆'
                            break;
                        case '天津市':
                            consignee.province = '天津'
                            break;
                        case '上海市':
                            consignee.province = '上海'
                            break;
                        }
                        console.log(`改造后的地址${JSON.stringify(consignee)}`)
                        that.setData({
                            consignee,
                        });
                        console.log(that.data.consignee)
                    } else {
                        that.setData({
                            consignee: {
                                address: '请填写收货地址'
                            },
                        });
                    }
                } else if (res.data.code == 400 || res.data.code == 401) {
                    // that.handleLoginPage();
                    console.log('获取地址失败')
                } else {

                }
            },
        });
    },


    // 获取运费
    fetchFreightByArea: function() {
        if (!!this.data.consignee.id && !!this.data.selectedDeliveryMethod) {

            wx.showLoading({
                title: '获取运费中',
                mask: true,
            });

            const {province = '', city = ''} = this.data.consignee;
            const district = this.data.consignee.county || '';
            let that = this;
            // 新获取运费接口
            let header = "application/json";
            let data = {
                data: {
                    province: province,
                    city: city,
                    district: district,
                    deliveryMethod: this.data.selectedDeliveryMethod || '',
                    money: this.data.allProductsAmount || 0
                }
            }
            console.log(data)
            api.post('/s2b/distribution/queryfreight', data, header).then(res => {
                console.log(res)
                if (res.code == 200) {
                    that.setData({
                        freight: res.data.freight || 0,
                    });
                    that.computeProductsCountAndAmount();
                } else {
                    wx.hideLoading()
                    that.setData({
                        freight: 0,
                    });
                    that.computeProductsCountAndAmount();
                    if (that.data.selectedDeliveryMethod == '送货上门并安装') {
                        wx.showModal({
                            title: '提示',
                            content: '您所选省市区获取运费失败，详情请咨询在线客服。',
                            success: function(event) {
                                that.setData({
                                    deliveryMethods: ["自提"],
                                    selectedDeliveryMethod: '',
                                });
                                that.handleToSelectedDeliveryMethod();
                            },
                        });
                    } else if (that.data.selectedDeliveryMethod == '自提') {
                        wx.showModal({
                            title: '提示',
                            content: '您所选省市区获取运费失败，详情请咨询在线客服。',
                            success: function(event) {
                                that.setData({
                                    deliveryMethods: ["送货上门并安装"],
                                    selectedDeliveryMethod: '',
                                });
                                that.handleToSelectedDeliveryMethod();
                            },
                        });
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: Message || '您所选省市区获取运费失败，详情请咨询在线客服。',
                            success: function(event) {},
                        });
                    }
                }
                wx.hideLoading()
            })
            // getFreightByArea({
            //   body: {
            //     province,
            //     city,
            //     district,
            //     deliveryMethod: this.data.selectedDeliveryMethod || '',
            //     money: this.data.allProductsAmount || 0,
            //   },
            //   success: function (res) {
            //     console.log(res);
            //     if (res.data.code == 200) {
            //       if (res.data.data.IsError) {
            //         // wx.showToast({
            //         //   title: res.data.data.Message || '',
            //         //   image: './images/toast_note.png'
            //         // });
            //         that.setData({
            //           freight: 0,
            //         });
            //         that.computeProductsCountAndAmount();
            //       } else {
            //         const Message = res.data.data.Message || '';
            //         if (!!Message) {
            //           if (that.data.selectedDeliveryMethod == '送货上门并安装') {
            //             wx.showModal({
            //               title: '提示',
            //               content: Message || '您所选省市区获取运费失败，详情请咨询在线客服。',
            //               success: function (event) {
            //                 that.setData({
            //                   deliveryMethods: ["自提"],
            //                   selectedDeliveryMethod: '',
            //                 });
            //                 that.handleToSelectedDeliveryMethod();
            //               },
            //             });
            //           } else if (that.data.selectedDeliveryMethod == '自提') {
            //             wx.showModal({
            //               title: '提示',
            //               content: Message || '您所选省市区获取运费失败，详情请咨询在线客服。',
            //               success: function (event) {
            //                 that.setData({
            //                   deliveryMethods: ["送货上门并安装"],
            //                   selectedDeliveryMethod: '',
            //                 });
            //                 that.handleToSelectedDeliveryMethod();
            //               },
            //             });
            //           } else {
            //             wx.showModal({
            //               title: '提示',
            //               content: Message || '您所选省市区获取运费失败，详情请咨询在线客服。',
            //               success: function (event) {

            //               },
            //             });
            //           }
            //         } else {
            //           const Value = res.data.data.Value || '{}';
            //           const value = JSON.parse(Value);
            //           console.log(value);
            //           that.setData({
            //             freight: value.money || 0,
            //           });
            //           that.computeProductsCountAndAmount();
            //         }
            //       }
            //     } else if (res.data.code == 400 || res.data.code == 401) {
            //       if (res.data.info == 'ERP服务器连接失败') {
            //         wx.showToast({
            //           title: '请稍后再试',
            //           icon: 'none',
            //           duration: 2000
            //         })
            //         return
            //       } else {
            //         that.handleLoginPage();
            //       }

            //     } else {

        //     }
        //   },
        // });
        } else if (!this.data.consignee.id) {
            // wx.showToast({
            //   title: '请选择收获地址',
            //   image: './images/toast_note.png'
            // });
        } else {
            // wx.showToast({
            //   title: '请选择配送方式',
            //   image: './images/toast_note.png'
            // });
        }

    },

    // 跳转配送方式选择
    handleToSelectedDeliveryMethod: function(e) {
        let that = this;
        wx.showActionSheet({
            itemList: that.data.deliveryMethods || [],
            success: function(e) {
                const {tapIndex = 0} = e;
                console.log(e);
                that.setData({
                    selectedDeliveryMethod: that.data.deliveryMethods[tapIndex],
                });
                if (that.data.selectPayModes != "梵豆支付") {
                    console.log('检测用户状态===========================')
                    console.log(that.data.customerState)
                    that.fetchFreightByArea();
                }

            },
        });
    // wx.navigateTo({
    //   url: '/pages/shipping-method/shipping-method',
    // });
    },

    // 跳转到支付方式选择
    handleToPayMode: function(e) {
        let that = this;
        wx.showActionSheet({
            itemList: that.data.payModes || [],
            success: function(e) {
                const {tapIndex = 0} = e;
                console.log(e)
                if (e.tapIndex == 0) {
                    if (that.data.beanPay == true) {
                        common.showModal('当前订单只能使用梵豆兑换。', '提示', function(res) {
                            if (res.confirm) {
                                return
                            }
                        })
                        return
                    }
                    that.setData({
                        payStatus: 'A',
                        selectPayModes: that.data.payModes[tapIndex]
                    })
                } else if (e.tapIndex == 1) {
                    if (that.data.beanPay == true) {
                        common.showModal('当前订单只能使用梵豆兑换。', '提示', function(res) {
                            if (res.confirm) {
                                return
                            }
                        })
                        return
                    }
                    that.setData({
                        payStatus: 'B',
                        selectPayModes: that.data.payModes[tapIndex]
                    })
                } else if (e.tapIndex == 2) {
                    if (that.data.beanPay == false) {
                        common.showModal('当前订单不能使用梵豆。', '提示', function(res) {
                            if (res.confirm) {
                                return
                            }
                        })
                        return
                    }
                    that.setData({
                        payStatus: 'C',
                        selectPayModes: that.data.payModes[tapIndex]
                    })
                }
            // that.setData({
            //   selectPayModes: that.data.payModes[tapIndex],
            // })
            }
        })

    },

    handleRemarkValueChanged: function(e) {
        const {value} = e.detail;
        this.setData({
            remark: value,
        });
    },

    handlePay: function(e) {

        for (let i = 0; i < this.data.list.length; i++) {
            let list = this.data.list
            if (list[i].stock < list[i].count) {
                common.showModal('所选的商品中存在库存不足。', '提示', function(res) {
                    if (res.confirm) {
                        return
                    }
                })
                return
            }
        }

        if (!this.data.consignee.id) {
            wx.showToast({
                title: '请选择收货地址',
                image: './images/toast_note.png'
            });
            return;
        } else if (!this.data.selectedDeliveryMethod) {
            wx.showToast({
                title: '请选择配送方式',
                image: './images/toast_note.png'
            });
            return;
        } else if (!this.data.selectPayModes) {
            wx.showToast({
                title: '请选择支付方式',
                image: './images/toast_note.png'
            });
            return;
        }

        // // 已经生成订单
        // if (!!this.data.orderId) {
        //   // 已经获取支付信息
        //   if (!!this.data.info) {

        //   } else {

        //   }
        // } else {

        // }

        if (!this.data.enabledPay) {
            console.log(!this.data.enabledPay)
            return;
        }
        if (this.data.beanPay == true && this.data.beanCount < parseFloat(this.data.totalPriceDecimal2)) {
            common.showModal('可用梵豆不足。', '提示', function(res) {
                if (res.confirm) {
                    return
                }
            })
            return
        }
        if (this.data.productCategories == '拼团') {
            if (this.data.canTapPay == false) {
                return
            }
            this.setData({
                canTapPay: false
            })
            if (this.data.list[0].count + this.data.list[0].GroupBuyCount > this.data.list[0].buylimt) {
                this.setData({
                    canTapPay: true
                })
                common.showModal('该商品限购' + this.data.list[0].buylimt + '件，您已购买' + this.data.list[0].GroupBuyCount + '件，请重新选择数量。', '提示', function(res) {
                    if (res.confirm) {
                        return
                    }
                })
                return
            }
            wx.showToast({
                title: '加载中',
                icon: 'loading',
                duration: 3000
            })
            this.confirmTuanInfo()
            return
        }
        let list = this.data.list || [];
        let that = this;
        console.log(list)
        console.log(that.data.payStatus)
        const orderdetailentity = list.map(function(product, index) {
            return {
                F_ProductID: product.product_id,
                F_ProductNumber: product.count,
                F_ShoppingCartID: product.id,
                F_Combination: product.combination_id,
            };
        });
        const body = {
            F_ShipAddressId: this.data.consignee.id || '',
            F_ShippingMethod: this.data.selectedDeliveryMethod || '',
            F_PaymentMethod: this.data.payStatus || '',
            F_PayMode: this.data.selectPayModes || '',
            F_Freight: this.data.freight || 0,
            F_Remarks: this.data.remark || '',
            F_DiscountCode: this.data.discountCode || '',
            F_DiscountAmount: this.data.discountMoney || 0,
            F_Longitude: this.data.longitude,
            F_Latitude: this.data.latitude,
            F_StoreId: this.data.storeid,
            F_StoreName: this.data.storeName == '无附近门店' ? '' : this.data.storeName,
            F_OrderType: this.data.F_OrderType,
            F_ID: this.data.F_ID,
            orderdetailentity,

        };
        console.log(body);
        this.setData({
            enabledPay: false,
        });
        wx.showLoading({
            title: '生成订单中',
            mask: true,
        });
        createOrder({
            body,
            success: function(res) {
                console.log(res);
                that.setData({
                    detailId: res.data.data.OrderId,
                })
                console.log(that.data.detailId)
                debugger
                if (res.data.code == 200) {
                    if (res.data.data.IsError) {
                        wx.showToast({
                            title: '创建订单失败',
                            image: './images/toast_note.png'
                        });
                    } else {
                        const orderId = res.data.data.Value.F_OrderNo || '';
                        const payname = '订单号: ' + orderId;
                        that.setData({
                            orderId,
                            F_RealPayAmount: res.data.data.Value.F_RealPayAmount //传到微信支付
                        });
                        if (that.data.payStatus == 'A') {
                            that.fetchWxpaydata();
                        } else if (that.data.payStatus == 'B') {
                            console.log('提交订单传成功')
                            wx.showToast({
                                title: '提交订单成功',
                                image: './images/toast_success.png',
                            });
                            setTimeout(function() {
                                wx.switchTab({
                                    url: '/pages/me/me?type=true'
                                });
                            }, 600);
                            return;
                        } else if (that.data.payStatus == 'C') {
                            if (that.data.beanCount >= parseFloat(that.data.totalPriceDecimal2)) {
                                wx.showToast({
                                    title: '兑换成功',
                                    image: './images/toast_success.png',
                                });
                                setTimeout(function() {
                                    wx.switchTab({
                                        url: '/pages/me/me?type=true'
                                    });
                                }, 600);
                                return;
                            }
                        }
                    }
                } else if (res.data.code == 400 || res.data.code == 401) {
                    // that.handleLoginPage();
                    if (!res.data.info == '订单中包含已售罄的商品，请删除后再提交订单') {
                        wx.showToast({
                            title: '创建订单失败',
                            image: './images/toast_note.png'
                        });
                    }

                    that.setData({
                        enabledPay: true
                    })
                } else {

                }
            },
        })
    },

    fetchWxpaydata: function() {

        const orderId = this.data.orderId || '';
        const payname = '订单号: ' + orderId;
        console.log(this.data.orderId)
        console.log(payname)
        let that = this;
        var price = Url.host == 'https://wxapp.uvanart.com' ? 1 : new Decimal(that.data.F_RealPayAmount).times(100)
        getWxpaydata({
            body: {
                // totalfee: price,
                // payname,
                id: orderId,
            },
            success: function(res) {
                console.log('获取支付信息');
                console.log(res);
                console.log(res.data.data);
                if (res.data.code == 200) {
                    // let info = {
                    //   timeStamp: res.data.data.timeStamp, 
                    //   nonceStr: res.data.data.config.nonce_str,
                    //   signType: 'MD5', 
                    //   paySign :  res.data.data.config.sign,
                    //   prepay_id: 'prepay_id=' + res.data.data.config.prepay_id
                    // }
                    const info = res.data.data;
                    that.setData({
                        info: info,
                    });
                    /*线上支付才会调用微信支付*/
                    if (that.data.beanPay == false) {

                        that.toPayByWeChat();
                    }
                } else if (res.data.code == 400 || res.data.code == 401) {
                    that.setData({
                        enabledPay: true,
                    });
                // that.handleLoginPage();
                } else {
                    that.setData({
                        enabledPay: true,
                    });
                }
            },
            fail: function(err) {
                that.setData({
                    enabledPay: true,
                });
            },
        });
    },

    toPayByWeChat: function() {
        let nowTime = Date.parse(new Date())
        let createTime = parseInt(Date.parse((this.data.CreateDate + '').split('-').join('/')))
        console.log(nowTime - createTime)
        debugger
        if (this.data.productCategories == '拼团' && nowTime - createTime >= 30 * 60 * 60 * 100) {
            wx.showToast({
                title: '支付已超时',
                image: './images/toast_note.png'
            });
            this.setData({
                canTapPay: true
            })

            wx.redirectTo({
                url: '../share/spellGroup/spellGroup?id=' + this.data.GroupBuyOrderID
            });
            return
        }
        let that = this;
        const info = this.data.info || {};
        const {timeStamp = '', nonceStr = '', signType = '', paySign = ''} = info || {};
        console.log('timeStamp:' + timeStamp)
        console.log('nonceStr:' + nonceStr)
        console.log('signType:' + signType)
        console.log('paySign:' + paySign)
        console.log('package:' + info.package)
        wx.requestPayment({
            timeStamp,
            nonceStr,
            'package': info.package || '',
            signType,
            paySign,
            success: function(res) {
                console.log(res)
                that.setData({
                    canTapPay: true,
                    discountCode: ''
                })
                // that.data.orderId
                console.log('支付成功');
                console.log(res);

                // that.setData({
                //   enabledPay: true,
                // });
                if (that.data.productCategories == '拼团') {
                    that.paySuccess();
                }
                wx.showToast({
                    title: '支付成功',
                    image: './images/toast_success.png',
                });

                setTimeout(function() {
                    if (that.data.productCategories == '拼团') {
                        wx.redirectTo({
                            url: '../share/spellGroup/spellGroup?id=' + that.data.GroupBuyOrderID
                        });
                        return
                    } else {
                        wx.switchTab({
                            url: '/pages/me/me?type=true'
                        });
                    }
                }, 600);
                modifyOrderStatus({
                    body: {
                        F_OrderNo: that.data.orderId,
                        F_OrderStatus: 'A',
                    },
                    success: function(res) {
                        // // 不需要处理
                        // if (res.data.code == 200) {

                        // } else if (res.data.code == 400 || res.data.code == 401) {

                        // } else {

                        // }
                        let designgoldData = {
                            "token": token,
                            "loginMark": phone,
                            "data": {
                                'orderNo': that.data.orderId
                            }
                        }
                        // api.post('/lr/s2bapi/designgold', designgoldData)
                        designgold(designgoldData)
                            .then(() => {
                                console.log(res)
                            })
                    },
                });
            },
            fail: function(err) {
                console.log('支付失败');
                console.log(err);
                that.setData({
                    enabledPay: true,
                    discountCode: ''
                });
                wx.showToast({
                    title: '支付失败',
                    image: './images/toast_note.png',
                });
                if (that.data.productCategories == '拼团') {
                    that.setData({
                        canTapPay: true
                    })
                    wx.redirectTo({
                        url: '../share/spellGroup/spellGroup?id=' + that.data.GroupBuyOrderID
                    });
                    return
                }
                modifyOrderStatus({
                    body: {
                        F_OrderNo: that.data.orderId,
                        F_OrderStatus: 'P',
                    },
                    success: function(res) {
                        console.log('支付失败，跳转到订单详情页')
                        wx.redirectTo({
                            url: '../me/orderList/productDetails/productDetails?id=' + that.data.detailId,
                        })
                        // wx.navigateBack({
                        //   delta: 1
                        // })
                        // // 不需要处理
                        // if (res.data.code == 200) {

                        // } else if (res.data.code == 400 || res.data.code == 401) {

                        // } else {

                    // }
                    },
                });
            },
        });
    },

    handleCancel: function(e) {
        wx.showModal({
            title: '提示',
            content: `是否取消${!!this.data.orderId ? '支付订单' : '生成订单'}?`,
            cancelText: '再等等',
            cancelColor: '#666666',
            confirmText: '取消',
            confirmColor: '#FF0000',
            success: function(event) {
                const {confirm = false} = event;
                if (confirm) {
                    wx.navigateBack({

                    });
                }
            },
        });
    },
    // 显示优惠码输入框
    showdiscountInput() {
        // debugger
        let height = wx.getSystemInfoSync().windowHeight + 'px';
        page = 1; //重置
        this.setData({
            showMore: false,
            couponList: [], //重置数组
            showdiscountinput: true,
            hiddenCouponsBounced: false,
            showdiscountinput: true,
            windowHeight: height
        })
        this.requireCouponsList();
    // if(this.data.discountinputTop==-80){
    //   this.setData({
    //     discountWinHeight: 160,
    //     discountinputTop: 0,
    //     showdiscountinput: true
    //   })
    // }else{
    //   this.setData({
    //     discountWinHeight: 80,
    //     discountinputTop: -80,
    //     showdiscountinput: false
    //   })
    // }
    },

    // 获取可用的优惠券
    requireCouponsList: function() {
        var _this = this
        let couponsListData = {
            "token": wx.getStorageSync('token'),
            "loginMark": wx.getStorageSync('phone'),
            "data": {
                "money": parseFloat(this.data.allProductsAmountDecimal2),
                "limit": count,
                "page": page
            }
        }
        let header = 'application/json'
        // api.post('/s2b/temactpi/MeetConditionsCoupons', couponsListData, header)
        MeetConditionsCoupons(couponsListData, header)
            .then(res => {
                console.log(res)
                if (res.code == 400 && res.info == "未找到满足条件优惠券") {
                    _this.setData({
                        onCoupons: true,
                        couponsText: '暂无优惠可用'
                    })
                } else if (res.code == 200) {
                    if (res.data.total == 1) {
                        _this.setData({
                            onlyOneCouponNum: true
                        })
                    } else {
                        _this.setData({
                            onlyOneCouponNum: false
                        })
                    }
                    let fzList = _this.data.couponList;
                    for (let i = 0; i < res.data.data.length; i++) {
                        fzList.push(res.data.data[i])
                    }
                    _this.setData({
                        onCoupons: false,
                        couponList: fzList,
                        couponsText: '优惠',
                        page: Math.ceil(res.data.total / count)
                    })
                    console.log(_this.data.page)
                }

            })
            // wx.request({
            //   url: 'http://192.168.1.228:31173/s2b/temactpi/MeetConditionsCoupons',
            //   data: {
            //     "token": wx.getStorageSync('token'),
            //     "loginMark": wx.getStorageSync('phone'),
            //     "data": {
            //       "money": parseInt(this.data.allProductsAmountDecimal2),
            //       "limit": count,
            //       "page": page
            //     }
            //   },
            //   method: 'POST',
            //   header: {
            //     'content-type': 'application/json' // 默认值
            //   },
            //   success: function (res) {
            //     console.log(res.data)
            //     if (res.data.code == 400 && res.data.info == "未找到满足条件优惠券") {
            //       _this.setData({
            //         onCoupons: true
            //       })
            //     } else if (res.data.code == 200) {
            //       let fzList = _this.data.couponList;
            //       for (let i = 0; i < res.data.data.data.length; i++) {
            //         fzList.push(res.data.data.data[i])
            //       }
            //       _this.setData({
            //         onCoupons: false,
            //         couponList: fzList,
            //         page: Math.ceil(res.data.data.total / count)
            //       })
            //       console.log(_this.data.page)
            //     }

    //   }
    // })
    },

    // 分页加载优惠券
    loadMore: function(e) {
        console.log('触发上拉')
        console.log(page)
        console.log(this.data.page)
        if (page >= this.data.page) {
            wx.showToast({
                title: '没有更多了',
                icon: 'none'
            })
            return;
        } else {
            page++;
            this.requireCouponsList()
        }
    },

    // 选择优惠券
    chooseCoupon: function(e) {
        console.log(e)
        if (this.data.discountCode != '' && this.data.comfirmCode) { //已经使用优惠码，不能再选择优惠券
            wx.showToast({
                title: '已经使用优惠码了，不能再使用优惠券哦！',
                icon: 'none'
            })
            return;
        }
        this.setData({
            checkedNoUseCoupon: false
        })
        let hisID = this.data.couponNum;
        let newID = e.currentTarget.dataset.id;
        if (hisID == newID) {
            this.setData({
                checked: !this.data.checked,
                couponNum: e.currentTarget.dataset.id
            })
        } else {
            this.setData({
                checked: true,
                couponNum: e.currentTarget.dataset.id
            })
        }
        this.setData({
            discountCode: e.currentTarget.dataset.prizecode
        })
        if (this.data.checked) {
            let mark = 1;
            this.setData({
                goodsamountfull: this.data.couponList[parseInt(e.currentTarget.dataset.id)].f_goodsamountfull
            })
            console.log('满减金额')
            console.log(this.data.goodsamountfull)
            this.discountMethod(mark)
        }
    },

    // 选择不使用优惠券
    chooseNoUseCoupon: function(e) {
        // this.giveupCode()  //放弃使用优惠券
        // if (this.data.discountCode != '' && this.data.comfirmCode) { //已经使用优惠码，不能再选择优惠券
        //   return;
        // }
        this.setData({
            goodsamountfull: '', //满减金额重置为空
            codeState: '' //重置状态
        })
        console.log(this.data.checked)
        if (this.data.checked && !this.data.checkedNoUseCoupon) {
            debugger
            this.giveupCode() //放弃使用优惠券
        }
        let hisID = this.data.couponNum;
        let newID = e.currentTarget.dataset.id;
        if (hisID == newID) {
            this.setData({
                checked: !this.data.checked,
                checkedNoUseCoupon: !this.data.checkedNoUseCoupon,
                couponNum: e.currentTarget.dataset.id
            })
        } else {
            this.setData({
                checked: true,
                checkedNoUseCoupon: true,
                couponNum: e.currentTarget.dataset.id
            })
        }
        if (this.data.checked) {
            this.colseShadow() //关闭优惠券弹框
        }
        if (this.data.discountCode != '' && this.data.comfirmCode) {
            debugger
            this.setData({
                checkedNoUseCoupon: true
            })
        }
        console.log(this.data.checkedNoUseCoupon)
    },
    // 点击隐藏层关闭优惠券弹框
    colseShadow: function() {
        this.setData({
            showMore: true,
            showdiscountinput: false,
            hiddenCouponsBounced: true,
            windowHeight: ''
        })
    },

    //跟踪用户在输入框输入的数据
    codeActiveChange: function(e) {
        let val = e.detail.value
        const _this = this
        if (val.length >= 8) {
            this.setData({
                discountCode: _this.trim(val)
            })
        }
    },
    //确认优惠码
    comfirmCodeBtn() {
        const _this = this
        console.log(this.data.checked)
        if (this.data.checked && !this.data.checkedNoUseCoupon) {
            wx.showModal({
                title: '优梵艺术艺术提醒您！',
                showCancel: false,
                content: '亲，您已经选择优惠券了，不能叠加使用优惠码哦，祝您购物愉快！',
            })
            return;
        }
        let regexpobj = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8}$/
        if (this.data.hasComfirm == true) {
            return
        } else if (!regexpobj.test(this.data.discountCode)) {
            this.setData({
                hasComfirm: true
            })
            common.showModal('请输入正确的优惠码。', '提示', function(res) {
                _this.setData({
                    hasComfirm: false
                })
                if (res.confirm) {
                    return
                }
            })
        } else {
            console.log(parseFloat(this.data.totalPriceDecimal2))
            let mark = 2;
            debugger
            this.discountMethod(mark)
        }

    },

    // 计算折扣后金额
    discountMethod: function(mark) {
        debugger
        console.log(mark)
        var _this = this
        let codeData = {
            "token": token,
            "loginMark": phone,
            "data": {
                "discountCode": this.data.discountCode,
                "amount": parseFloat(this.data.allProductsAmountDecimal2),
                "freight": 0
            }
        }
        let header = 'application/json'
        // api.post('/s2b/temactpi/CalcuDiscount', codeData, header)
        CalcuDiscount(codeData, header)
            .then(res => {
                debugger
                console.log(res)
                console.log('使用优惠券成功使用优惠券成功使用优惠券成功')
                if (res.code == 200) {
                    console.log(res.info)
                    console.log(parseFloat(_this.data.totalPriceDecimal2) - res.data)
                    if (mark == 2) {
                        _this.setData({
                            comfirmCode: true,
                        })
                    } else if (mark == 1) {
                        _this.setData({
                            comfirmCoupons: true
                        })
                    }
                    _this.setData({
                        codeState: res.info,
                        discountMoney: res.data,
                        theRealPrice: parseFloat(_this.data.totalPriceDecimal2) - res.data,
                    })
                    _this.colseShadow(); //关闭弹框
                    if (mark != 3) {
                        wx.showToast({
                            title: '使用成功',
                            icon: 'none'
                        })
                    }
                    if (_this.data.theRealPrice <= 0) {
                        common.showModal('该优惠码不适用于该订单。', '提示', function(res) {
                            _this.setData({
                                discountCode: '',
                                discountMoney: '',
                                theRealPrice: parseFloat(_this.data.totalPriceDecimal2),
                                hasComfirm: false,
                                comfirmCode: false
                            })
                            if (res.confirm) {
                                return
                            }
                        })
                    }
                } else if (res.code == 400) {
                    console.log('使用优惠券失败使用优惠券失败使用优惠券失败')
                    common.showModal(res.info, '提示', function(res) {
                        _this.setData({
                            hasComfirm: false
                        })
                        if (res.confirm) {
                            return
                        }
                    })
                }
            })

            // wx.request({
            //   url: 'http://192.168.1.228:31173/s2b/temactpi/CalcuDiscount',
            //   data: codeData,
            //   method: 'POST',
            //   header: {
            //     'content-type': 'application/json' // 默认值
            //   },
            //   success: function (res) {
            //     console.log(res.data)
            //     if (res.data.code == 200) {
            //       console.log(res.data.info)
            //       console.log(parseFloat(_this.data.totalPriceDecimal2) - res.data.data)
            //       if (mark == 2) {
            //         _this.setData({
            //           comfirmCode: true,
            //         })
            //       } else if (mark == 1) {
            //         _this.setData({
            //           comfirmCoupons: true
            //         })
            //       }
            //       _this.setData({
            //         codeState: res.data.info,
            //         discountMoney: res.data.data,
            //         theRealPrice: parseFloat(_this.data.totalPriceDecimal2) - res.data.data,
            //       })
            //       _this.colseShadow(); //关闭弹框
            //       wx.showToast({
            //         title: '使用成功',
            //         icon: 'none'
            //       })
            //       if (_this.data.theRealPrice <= 0) {
            //         common.showModal('该优惠码不适用于该订单。', '提示', function (res) {
            //           _this.setData({
            //             discountCode: '',
            //             discountMoney: '',
            //             theRealPrice: parseFloat(_this.data.totalPriceDecimal2),
            //             hasComfirm: false,
            //             comfirmCode: false
            //           })
            //           if (res.confirm) {
            //             return
            //           }
            //         })
            //       }
            //     } else if (res.data.code == 400) {
            //       common.showModal(res.info, '提示', function (res) {
            //         _this.setData({
            //           hasComfirm: false
            //         })
            //         if (res.confirm) {
            //           return
            //         }
            //       })
            //     }
            //   }
            // })

    },

    //放弃使用优惠码
    giveupCode() {
        this.setData({
            theRealPrice: parseFloat(this.data.totalPriceDecimal2),
            discountCode: '',
            discountMoney: '',
            comfirmCode: false,
            comfirmCoupons: false
        })
        this.colseShadow() //关闭弹框
        console.log(this.data.discountCode)
    },
    // 统一处理400/401
    handleLoginPage: function() {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '还未登录, 现在去登录?',
            cancelText: '先逛逛',
            cancelColor: '#666666',
            confirmText: '去登录',
            confirmColor: '#3CC51F',
            success: function(event) {
                const {confirm = false} = event;
                if (confirm) {
                    wx.navigateTo({
                        url: '../me/twicelogin/twicelogin',
                    });
                }
            },
            fail: function() {
                // Do nothing.
            },
        });
    },

    // PersonCount=已选的团购人数
    // F_GroupBuyOrderID=初次团购留空
    // F_GroupCommanderOpenID=团长openid
    // F_Count=选购数量
    // F_ShipAddressId=收货地址ID
    // F_GroupBuyProductID=团购商品ID，必传


    confirmTuanInfo: function() {
        let buydata = {}
        let list = this.data.list[0]
        //开团/参团传参 this.data.list[0].orderID未空就是开团
        buydata = {
            "token": token,
            "loginMark": phone,
            "data": {
                "PersonCount": list.tuanScale, //团规模
                "OrederDetail": {
                    "F_GroupBuyProductID": list.id, //商品ID
                    "F_GroupBuyOrderID": this.data.list[0].orderID == '' ? '' : list.orderID, //团单ID，开团没有，参团才有
                    "F_SKU": list.SKU, //商品SKU
                    "F_GroupCommanderOpenID": list.GroupCommanderOpenID, //团长ID
                    "F_Count": list.count, //选购数量
                    "F_Price": list.product_price.toFixed(2), //商品价格
                    "F_ShipAddressId": this.data.consignee.id, //地址ID
                    "F_ShippingMethod": this.data.selectedDeliveryMethod, //配送方式
                    "F_ShippingAddress": "地址", //这里开始可以不传
                    "F_ConsigneeName": "收货人",
                    "F_ConsigneePhone": "收货人电话"
                }
            }
        }


        // api.post('/s2b/groupbuy/Buy', buydata, 'application/json')
        Buy(buydata, 'application/json')
            .then(res => {
                console.log(res)
                if (res.code == 200) {
                    console.log('开团/参团成功')
                    this.setData({
                        payMoney: res.data.F_Payable, //需要支付的金额
                        tradeNo: res.data.F_TradeNo, //需要返回给后台的订单号
                        GroupBuyOrderID: res.data.F_GroupBuyOrderID, //团ID
                        CreateDate: res.data.F_CreateDate, //下单时间
                    })
                    this.fetchWxpaydata();
                } else if (res.code == 400) {
                    wx.redirectTo({
                        url: '../share/spellGroup/spellGroup?id=' + this.data.GroupBuyOrderID
                    })
                }
            })
    },
    //拼团支付成功后回传
    paySuccess: function() {
        var payData = {
            "token": token,
            "loginMark": phone,
            "data": this.data.tradeNo
        }
        // api.post('/s2b/groupbuy/PaySuccess', payData, 'application/json')
        PaySuccess(payData, 'application/json')
            .then(res => {
                console.log(res)
                console.log('拼团支付信息回传了')
            })
    },
    trim: function(s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    },

})