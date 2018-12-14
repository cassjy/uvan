// pages/shopping-cart/shopping-cart.js
/**
 * 注意: priceDecimal2只用于显示商品价格, 不可用于计算;
 */
var api = require("../../utils/API/request.js")
var common = require("../../utils/common.js")
const Decimal = require('../../utils/decimal.js');
const {getMyShoppingCart, addShoppingCart, delshoppingcart, editshoppingcart, } = require('../../utils/HttpUtils.js');
const {readUvanartToken, updateShoppingCart, readShoppingCart, removeShoppingCart, removeAllShoppingCart, insertShoppingCart} = require('../../utils/StorageUtils.js');
import { ReceiveShoppingCart, GetShareshoppingCartdetails, AddShareCart, GetProductDetail_2 } from '../../utils/API/shoppingcart/api.js';
var app = getApp()
var PACM = []
var PACMXML = []

var productID = ''
// var PACMID = 0
var productAttr = ''
var oldInventory = 0
var E = {}
var idStr = ''
var tapAllBtn = false
var indexArr = []

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowLoading: true,
        isLogin: false,
        list: [],
        isEditStatus: false,
        // 防止编辑的时候, 触发cell点击事件
        isShowKeyboard: false,
        isCheckedAllValidProducts: false,
        allValidProductsCount: 0,
        allCheckedValidProductsAmount: '0',
        allCheckedValidProductsCount: 0,
        isCheckedAll: false,
        isTap: false,
        isTap2: false,
        isTapAttr: false,

        ProductAttributeCombinationModel: [],
        caculatePrice: "",
        Inventory: 100,
        num: 1,
        hiddenInventory: true,
        canConfirm: false,
        fromConfirm: false,
        status: 'done', //编制状态才初始化时done,
        canhandle: true,
        beanPay: "无梵豆商品",
        nowProductCate: '', //当前编辑规格的商品的分类

        imgURL: [],
        productName: '',
        F_MianImageList: '', //是否有可配置主图
        productAttributes: [], //商品规格分类
        nowAttrID: [], //控制规格是否被选择的样式,存放的是当前选择的规格ID
        nowAttrParentID: [], //控制规格是否被选择的样式，存放的是当前选择的规格父级ID
        nowAttrName: [], //当前选择了的规格名称
        nowAttrCombineName: [], //当前选择了的规格组合全称
        hasCombination: false, //判断是否存在该组合
        unitPrice: 0, //单价
        nowCombinationID: '', //当前规格组合的ID
        nowCombinationName: '', //当前规格组合的名称
        nowIndex: '',
        dontNeedToAdd: false, //是否需要向组合数组添加初始值
        canShareList: false, //是否可以分享清单
        hasShareList: false, //打开购物车是否有购物清单
        listChecked: [], //选中的商品列表，用于分享清单
        myToken: '',
        myPhone: '',
        shareListID: '', //分享清单ID
        haslist: true, //判断购物车有没有商品，没有就不可能出现分享按钮
        showShareWin: false, //是否显示分享弹窗
        canClickGetShare: true, //防止多次点击
        fromWhere: '', //来源订单详情
        combinationId: [], //商品组合ID
        num: 1,
    },

    //打开商品详情事件
    openDetail: function(e) {
        const _this = this
        console.log(e)
        if (this.data.status == 'edit') {
            console.log('编制状态不能跳转到详情页')
            return;
        } else {
            wx.navigateTo({
                url: '../categories/detail/detail?index=' + e.currentTarget.dataset.index + '&shopCart=' + e.currentTarget.dataset.mark + '&catename=' + e.currentTarget.dataset.catename
            })
        }
    },

    // 两位小数点
    toDecimal2: function(v) {
        let f = parseFloat(v);
        if (isNaN(f)) {
            return "0.00";
        } else {
            return new Decimal(v).toFixed(2);
        }
    },

    // 重置购物车列表时, 需调用此方法.
    onChangedProucts: function(products = []) {
        let list = products || [];
        let that = this;
        console.log(list)
        // debugger
        //控制分享按钮的显示隐藏
        for (let i = 0; i < list.length; i++) {
            if (list[i].isChecked) {
                this.setData({
                    canShareList: true
                })
                break
            } else {
                this.setData({
                    canShareList: false
                })
            }
        }
        if (list == []) {
            this.setData({
                haslist: false
            })
        }
        list = list.map(function(product, index) {
            const isChecked = product.isChecked || false;
            return Object.assign({}, product, {
                isChecked,
                priceDecimal2: that.toDecimal2(product.product_price),
            });
        });
        // debugger
        // 如果来源订单详情，则改造数据
        if (this.data.fromWhere == 'orderDetail') {
            debugger
            this.setData({
                fromWhere: ''
            })
            console.log('检测combinationId=========================')
            console.log(list)
            console.log(this.data.combinationId)
            for (let i = 0; i < list.length; i++) {
                list.forEach(function(item, index, input) {
                    if (input[index].combination_id == that.data.combinationId[i]) {
                        input[index].isChecked = true
                        idStr += list[i].id + ','
                        indexArr.push(i)
                    }
                })
            }
        }
        console.log(idStr)
        console.log(list)
        debugger
        this.setData({
            list: list,
            isShowLoading: false,
            canhandle: true
        });
        console.log(this.data.list)
        debugger
        this.computeAllCheckedProductsCountAndAmount();
    },

    // 计算选中的数量已经价格
    computeAllCheckedProductsCountAndAmount: function() {
        const list = this.data.list || [];
        const _this = this
        let count = 0;
        let amount = 0;
        let publishedCount = 0;

        list.map(function(product, index) {
            if (product.isChecked == true) {
                count += 1;
                amount = new Decimal(product.product_price).times(product.count).plus(amount);
                _this.setData({
                    isCheckedAll: true
                })
                if (product.published == false) {
                    publishedCount++
                }
            }
        });
        if (count == 0) {
            this.setData({
                isCheckedAll: false
            })
        }
        this.setData({
            allValidProductsCount: list.length,
            allCheckedValidProductsAmount: this.toDecimal2(amount),
            allCheckedValidProductsCount: count,
            publishedCount
        });

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        if (!!options.fromOrderDetail) {
            debugger
            // 处理商品组合id
            let combinationIdList = options.F_Combination.split(",")
            console.log(combinationIdList)
            // debugger
            this.setData({
                fromWhere: options.fromOrderDetail,
                combinationId: combinationIdList
            })
            console.log(this.data.combinationId)
        }
        // debugger
        // debugger
        if (options.openid) {
            //公共分享的访问记录
            let invitationID = options.invitationID
            let originalOpenid = options.openid
            common.commonVisitRecord(invitationID, originalOpenid)
        }


        console.log('onLoad');
        console.log(options.fromsharelist)
        console.log(options.sharelistid)
        if (options.fromsharelist) {
            let phone = wx.getStorageSync("phone")
            if (phone == '') {
                this.handleLoginPage()
            }
            this.setData({
                hasShareList: true,
                isTap2: true,
                shareListID: options.sharelistid
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        console.log('onReady');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //开始计时（停留时间）
        stayTime_JY = 0 //停留时间
        stayTimer_JY = setInterval(() => {
            stayTime_JY++
        }, 1000)

        console.log(this.data.isEditStatus)
        console.log(this.data.canShareList)
        console.log(this.data.allCheckedValidProductsCount)
        debugger
        idStr = ''
        tapAllBtn = false
        indexArr = []
        console.log('onShow');
        // 重置全局对象值
        console.log(app.globalData)
        console.log(this.data.isLogin);
        if (wx.getStorageSync('phone') != '') {
            this.setData({
                isLogin: true
            })
        } else {
            this.setData({
                isLogin: false
            })
        }
        this.setData({
            // isLogin: !!readUvanartToken(),
            beanPay: "无梵豆商品",
            canShareList: false,
        // allCheckedValidProductsCount: 0
        });
        //控制分享按钮的显示隐藏
        for (let i = 0; i < this.data.list.length; i++) {
            if (this.data.list[i].isChecked) {
                this.setData({
                    canShareList: true
                })
                break
            } else {
                this.setData({
                    canShareList: false
                })
            }
        }
        console.log(this.data.isLogin);
        //判断全局变量是否被修改(是则不刷新)
        let token = ''
        let phone = ''
        try {
            token = wx.getStorageSync('token') || ''
            phone = wx.getStorageSync('phone') || ''
            this.setData({
                myToken: token,
                myPhone: phone
            })
        } catch ( e ) {
            console.log('未登录')
        }
        if (app.globalData.shoppingCartLoading == "loading") {
            console.log('刷新购物车')
            let time = setInterval(() => {
                debugger
                // if(token!=''){
                this.fetchMyShoppingCart();
                clearInterval(time)
            // }
            }, 500)

        } else {
            app.globalData.shoppingCartLoading = "loading";
            console.log('不刷新购物车')
            return;
        }

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        //离开时插入访问记录
        clearInterval(stayTimer_JY)
        common.visitorRecordAPI(stayTime_JY, "购物车")
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        //离开时插入访问记录
        clearInterval(stayTimer_JY)
        common.visitorRecordAPI(stayTime_JY, "购物车")
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        console.log('onPullDownRefresh');
        this.fetchMyShoppingCart();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},


    fetchMyShoppingCart: function() {
        wx.showLoading({
            title: '加载中...',
            mask: true,
        });

        if (this.data.isLogin) {
            console.log('已经登录');
            let that = this;
            if (readShoppingCart().length > 0) {
                console.log('本地有缓存');
                addShoppingCart({
                    body: readShoppingCart(),
                    success: function(res) {
                        console.log(res);
                        if (res.data.code == 200) {
                            console.log('本地提交服务器成功');
                            console.log('清空本地缓存');
                            removeAllShoppingCart({
                                success: function() {
                                    console.log('清空本地缓存成功');
                                    getMyShoppingCart({
                                        success: function(res) {
                                            console.log(res);
                                            console.log('获取后台购物车数据');
                                            if (res.data.code == 200) {
                                                let list = res.data.data || [];

                                                that.onChangedProucts(list);
                                            } else if (res.data.code == 400 || res.data.code == 401) {
                                                that.setData({
                                                    isLogin: false,
                                                    isShowLoading: false,
                                                });
                                                debugger
                                                that.handleLoginPage();
                                            } else {

                                            }
                                        },
                                        fail: function(err) {
                                            console.log(err);
                                            that.setData({
                                                isShowLoading: false,
                                            });
                                        },
                                    });
                                }
                            });
                        } else if (res.data.code == 400 || res.data.code == 401) {
                            that.setData({
                                isLogin: false,
                                isShowLoading: false,
                            });
                            debugger
                            that.handleLoginPage();
                        }
                    },
                    fail: function() {
                        that.setData({
                            isShowLoading: false,
                        });
                    },
                });

            } else {
                console.log('本地无缓存');
                console.log('获取后台购物车数据');
                getMyShoppingCart({
                    success: function(res) {
                        console.log(res);
                        that.setData({
                            isShowLoading: false,
                        });
                        if (res.data.code == 200) {
                            let list = res.data.data || [];

                            that.onChangedProucts(list);
                            console.log("finish")
                        } else if (res.data.code == 400 || res.data.code == 401) {
                            that.setData({
                                isLogin: false,
                                isShowLoading: false,
                            });
                            that.handleLoginPage();
                        } else {

                        }
                    },
                    fail: function(err) {
                        console.log(err);
                        that.setData({
                            isShowLoading: false,
                        });
                    },
                });
            }

        } else {
            let list = readShoppingCart();
            console.log('list.length' + list.length)
            this.setData({
                isShowLoading: false,
            });

            wx.stopPullDownRefresh();
            this.onChangedProucts(list);
            setTimeout(function() {
                wx.stopPullDownRefresh();
                wx.hideLoading();
            }, 400);
        }

    },

    handleEdit: function(e) {
        console.log(e)
        console.log('handleEdit');
        this.setData({
            isEditStatus: true,
            status: e.currentTarget.dataset.edit
        });
    },

    handleDone: function(e) {
        console.log('handleDone');
        this.setData({
            isEditStatus: false,
            status: 'done' //用户点击完成时状态改成done
        });
    },

    doNothing: function(e) {},

    // Mark: - Input 相关
    bindinput: function(e) {
        console.log('bindinput');
        console.log(e);

        const {value, cursor} = e.detail;
        const dataset = e.currentTarget.dataset || {};
        const {index = 0} = dataset;
        let list = this.data.list || [];
        let product = list[index] || {};
        console.log('value', value);

        if (this.data.isLogin || !!product.id) {
            if (value == '' || /^([1-9][0-9]{0,2})?$/.test(value.substr(0, 3))) {
                if (value == '') {
                    return value;
                } else {
                    return value.substr(0, 3);
                }
            } else {
                return `${product.count}`;
            }
        } else {
            if (value == '' || /^([1-9][0-9]{0,2})?$/.test(value)) {
                if (value == '') {
                    return value;
                } else {
                    product.count = value;
                    list[index] = product;
                    updateShoppingCart({
                        value: product
                    });
                    this.onChangedProucts(list);

                    return value;
                }
            } else {
                return `${product.count}`;
            }
        }

    },

    bindfocus: function(e) {
        console.log('bindfocus');
        this.setData({
            isShowKeyboard: true,
        });
    },

    bindblur: function(e) {
        const _this = this
        let {value = ''} = e.detail;
        const dataset = e.currentTarget.dataset || {};
        const {index = 0} = dataset;
        const product = this.data.list[index] || {};
        if (value == '') {
            value = 1
        }
        this.setData({
            isShowKeyboard: false,
        });
        if (parseInt(value) > product.stock) {
            common.showModal('输入的数量已超出大于库存或库存不足。', '提示', function(res) {
                if (res.confirm) {
                    if (!!product.id && value != '' && /^(\d+)$/.test(value) && value != `${product.count}`) {
                        let combination_id = product.combination_id
                        // product.count = product.stock
                        if (value == 1) {
                            _this.updateRemoteShoppingCart({
                                product,
                                index,
                                count: 1,
                                combination_id
                            });
                        } else {
                            _this.updateRemoteShoppingCart({
                                product,
                                index,
                                count: product.stock,
                                combination_id
                            });
                        }
                    } else if (!!product.id && value != '' && /^(\d+)$/.test(value) && value == 1) {
                        let combination_id = product.combination_id
                        // product.count = product.stock
                        _this.updateRemoteShoppingCart({
                            product,
                            index,
                            count: 1,
                            combination_id
                        });
                    }
                    return
                }
            })
            return;
        }
        if (!!product.id && value != '' && /^(\d+)$/.test(value) && value != `${product.count}`) {
            let combination_id = product.combination_id
            if (value == 1) {
                this.updateRemoteShoppingCart({
                    product,
                    index,
                    count: 1,
                    combination_id
                });
            } else {
                this.updateRemoteShoppingCart({
                    product,
                    index,
                    count: parseInt(value),
                    combination_id
                });
            }
        } else if (!!product.id && value != '' && /^(\d+)$/.test(value) && value == 1) {
            let combination_id = product.combination_id
            // product.count = product.stock
            _this.updateRemoteShoppingCart({
                product,
                index,
                count: 1,
                combination_id
            });
        }
    },

    // // 修改本地购物车数据
    // updateLocationShoppingCart: function (product = {}) {
    //   if (!!product) {
    //     // TODO
    //   }
    // },

    /**
     * 修改服务器购物车数据
     */
    updateRemoteShoppingCart: function({product = {}, index = 0, count = 1, combination_id}) {
        // wx.showLoading({
        //   title: '修改中...',
        //   mask: true,
        // });
        console.log('updateRemoteShoppingCart');
        let that = this;
        editshoppingcart({
            body: {
                id: product.id,
                count,
                combination_id
            },
            success: function(res) {
                console.log(res)
                if (res.data.code == 200) {
                    wx.showLoading({
                        title: '修改成功',
                    });
                    let list = that.data.list || [];
                    let pro = list[index];
                    pro.count = count;
                    pro.combination_id = combination_id
                    if (that.data.fromConfirm) {
                        pro.product_specifications = res.data.data.F_CombinationName
                        pro.product_price = res.data.data.F_Price
                        pro.stock = res.data.data.F_Stock
                    }
                    list[index] = pro;
                    that.onChangedProucts(list);
                    // that.setData({
                    //   canhandle: true
                    // })
                    if (that.data.fromConfirm) {
                        that.fetchMyShoppingCart()
                    }
                    console.log("no fresh")
                } else if (res.data.code == 400 && res.data.info == "访问受限") {
                    that.setData({
                        canhandle: true
                    })
                    return
                } else if (res.data.code == 400 || res.data.code == 401) {
                    that.setData({
                        isLogin: false,
                        canhandle: true
                    });
                    that.handleLoginPage();
                } else {
                    that.setData({
                        canhandle: true
                    })
                }
                setTimeout(function() {
                    wx.hideLoading();
                }, 400);
            },
        });
    },


    // 减少商品数量
    handleDecrease: function(e) {
        if (this.data.canhandle) {
            this.setData({
                canhandle: false
            })
            console.log('handleDecrease');
            const dataset = e.currentTarget.dataset || {};
            const {index = 0} = dataset;
            let list = this.data.list || [];
            let product = list[index] || {};
            let combination_id = product.combination_id

            if (+product.count <= 1) {
                return;
            }

            if (!product.id) {
                // 有本地缓存, 即未上传(未登录)
                // 修改本地数据
                product.count = +product.count - 1;
                list[index] = product;
                updateShoppingCart({
                    value: product
                });

                this.onChangedProucts(list);

            } else {
                console.log(product)
                const count = product.count;
                this.updateRemoteShoppingCart({
                    product,
                    index,
                    count: count - 1,
                    combination_id
                });
            }
        }

    },
    // 增加商品数量
    handleIncrease: function(e) {
        if (this.data.canhandle) {
            this.setData({
                canhandle: false
            })
            console.log('handleIncrease');
            const dataset = e.currentTarget.dataset || {};
            const {index = 0} = dataset;

            let list = this.data.list || [];
            let product = list[index] || {};
            let combination_id = product.combination_id
            console.log("combination_id" + combination_id)
            if (+product.count >= 999) {
                return;
            }

            if (+product.count >= product.stock) {
                common.showModal('输入的数量已超出库存量或库存不足。', '提示', function(res) {
                    if (res.confirm) {
                        return
                    }
                })
                this.setData({
                    canhandle: true
                })
                return;
            }
            // else {
            //   product.count += 1;
            //   list[index] = product;
            //   updateShoppingCart({ value: product});
            //   this.setData({
            //     list,
            //   });
            // }


            if (!product.id) {
                // 有本地缓存, 即未上传(未登录)
                // 修改本地数据
                product.count = +product.count + 1;
                list[index] = product;
                updateShoppingCart({
                    value: product
                });

                this.onChangedProucts(list);

            } else {
                const count = product.count;
                this.updateRemoteShoppingCart({
                    product,
                    index,
                    count: count + 1,
                    combination_id
                });
            }


        }

    },

    deleteProduct: function(e) {
        const dataset = e.currentTarget.dataset || {};
        const {index = 0} = dataset;
        const product = this.data.list[index] || {};
        let that = this;
        if (this.data.isLogin && !!product.id) {

            let list = this.data.list || [];

            wx.showLoading({
                title: '删除中...',
                mask: true,
            });
            console.log(product)
            // debugger
            delshoppingcart({
                body: product.id,
                success: function(res) {
                    console.log(res);
                    if (res.data.code == 200) {
                        wx.showLoading({
                            title: '删除成功',
                        });
                        //控制分享按钮的显示隐藏
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].isChecked) {
                                that.setData({
                                    canShareList: true
                                })
                                break
                            } else {
                                that.setData({
                                    canShareList: false
                                })
                            }
                        }
                        list = list.filter(function(item, idx) {
                            return idx != index && item.id != product.id;
                        });
                        that.onChangedProucts(list);
                    } else if (res.data.code == 400 || res.data.code == 401) {
                        that.setData({
                            isLogin: false,
                        });
                        that.handleLoginPage();
                    } else {

                    }
                    setTimeout(function() {
                        wx.hideLoading();
                    }, 400);
                },
            });
        } else {

            removeShoppingCart({
                value: product,
                success: function() {
                    let list = readShoppingCart();
                    that.onChangedProucts(list);
                },
            });
        }
    },
    deleteProductMore: function() {

        let that = this
        let list = this.data.list || []
        console.log(this.data.list)
        // debugger
        if (this.data.isLogin) {

            wx.showLoading({
                title: '删除中...',
                mask: true,
            });

            delshoppingcart({
                body: idStr,
                success: function(res) {
                    console.log(res);
                    if (res.data.code == 200) {
                        wx.showLoading({
                            title: '删除成功',
                        });
                        //控制分享按钮的显示隐藏
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].isChecked) {
                                that.setData({
                                    canShareList: true
                                })
                                break
                            } else {
                                that.setData({
                                    canShareList: false
                                })
                            }
                        }
                        for (let i = 0; i < indexArr.length; i++) {
                            if (indexArr[i] < 0) {
                                indexArr[i] = 0
                            }
                            list.splice(indexArr[i], 1)
                            for (let j = 0; j < indexArr.length; j++) {
                                indexArr[j] = indexArr[j] - 1
                            }
                        }
                        indexArr = []
                        // debugger
                        console.log(list)
                        that.onChangedProucts(list);
                    } else if (res.data.code == 400 || res.data.code == 401) {
                        that.setData({
                            isLogin: false,
                        });
                        that.handleLoginPage();
                    } else {

                    }
                    setTimeout(function() {
                        wx.hideLoading();
                    }, 400);
                },
            });
        } else {
            for (let i = 0; i < indexArr.length; i++) {
                if (indexArr[i] < 0) {
                    indexArr[i] = 0
                }
                removeShoppingCart({
                    value: list[i],
                    success: function() {
                        let list = readShoppingCart();
                        that.onChangedProucts(list);
                    },
                });
                for (let j = 0; j < indexArr.length; j++) {
                    indexArr[j] = indexArr[j] - 1
                }
            }
        }
    },

    handleDelete: function(e) {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '是否将该商品从购物车移除?',
            cancelText: '取消',
            cancelColor: '#666666',
            confirmText: '移除',
            confirmColor: '#FF0000',
            success: function(event) {
                const {confirm = false} = event;
                if (confirm) {
                    that.deleteProduct(e);
                }
            },
        })

    },
    handleDeleteMore: function() {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '是否将所选商品从购物车移除?',
            cancelText: '取消',
            cancelColor: '#666666',
            confirmText: '移除',
            confirmColor: '#FF0000',
            success: function(event) {
                const {confirm = false} = event;
                if (confirm) {
                    that.deleteProductMore();
                }
            },
        })

    },

    // 勾选某个商品
    handleCheckedProduct: function(e) {
        console.log('handleCheckedProduct');

        const dataset = e.currentTarget.dataset || {};
        const {index = 0} = dataset;
        console.log(dataset, index);

        let list = this.data.list || [];
        let product = list[index] || {};

        if (tapAllBtn) {
            idStr.split(',' + product.id).join('')
        }
        product.isChecked = !product.isChecked;
        debugger
        if (product.isChecked == true) {
            indexArr.push(index)
        } else {
            for (let i = 0; i < indexArr.length; i++) {
                if (indexArr[i] == index) {
                    indexArr.splice(i, 1)
                }
            }
        }

        if (product.isChecked == true) {
            if (idStr == '') {
                idStr = product.id
                debugger
            } else {
                idStr = idStr + ',' + product.id
            }
        } else {
            if (index == 0) {
                debugger
                idStr = idStr.replace(product.id + ',', '')
            } else {
                idStr = idStr.replace(',' + product.id, '')
            }


        }
        console.log(indexArr)
        console.log(idStr)
        list[index] = product;
        // this.setData({
        //   list,
        // });
        console.log(product)
        //控制分享按钮的显示隐藏
        for (let i = 0; i < list.length; i++) {
            if (list[i].isChecked) {
                this.setData({
                    canShareList: true
                })
                break
            } else {
                this.setData({
                    canShareList: false
                })
            }
        }
        //创建分享清单的参数
        let listChecked = list
        listChecked = listChecked.filter(function(product, index) {
            return product.isChecked;
        });
        listChecked = listChecked.map(function(product, index) {
            const {product_id = '', count = 1, combination_id = ''} = product;
            return {
                product_id,
                count,
                combination_id,
            };
        })
        this.setData({
            listChecked
        })
        console.log(this.data.listChecked)
        // this.computeAllCheckedProductsCountAndAmount();
        debugger
        this.onChangedProucts(list);
        console.log(list)
    },

    // 全选按钮
    handleCheckedAllProducts: function(e) {
        if (this.data.list.length == 0) {
            return
        }
        tapAllBtn = !tapAllBtn
        idStr = ''
        indexArr = []
        console.log('handleCheckedAllProducts');
        // 不相等, 进行'全选'操作; 相等, 取消'全选'操作.
        const isChecked = this.data.allValidProductsCount != this.data.allCheckedValidProductsCount;
        let list = this.data.list || [];

        list = list.map(function(product, index) {
            if (tapAllBtn) {
                if (idStr == '') {
                    idStr = product.id
                } else {
                    idStr = idStr + ',' + product.id
                }
            } else {
                idStr = ''
            }

            return Object.assign({}, product, {
                isChecked,
            });

        });
        if (tapAllBtn) {
            for (let i = 0; i < list.length; i++) {
                indexArr.push(i)
            }
        }
        console.log(idStr + '------')
        // this.setData({
        //   list,
        // });
        // this.computeAllCheckedProductsCountAndAmount();
        this.setData({
            isCheckedAll: !this.data.isCheckedAll
        })
        //控制分享按钮的显示隐藏
        if (this.data.isCheckedAll) {
            this.setData({
                canShareList: true
            })
        } else {
            this.setData({
                canShareList: false
            })
        }
        //创建分享清单的参数
        let listChecked = list
        listChecked = listChecked.filter(function(product, index) {
            return product.isChecked;
        });
        listChecked = listChecked.map(function(product, index) {
            const {product_id = '', count = 1, combination_id = ''} = product;
            return {
                product_id,
                count,
                combination_id,
            };
        })
        this.setData({
            listChecked
        })
        console.log(this.data.listChecked)
        this.onChangedProucts(list);
    },

    // 结算
    handleSubmitCart: function(e) {
        console.log('isLOgin:' + this.data.isLogin)
        const _this = this
        for (let i = 0; i < this.data.list.length; i++) {
            let list = this.data.list
            if (list[i].stock < list[i].count && list[i].isChecked == true || this.data.publishedCount > 0) {
                common.showModal('所选的商品中存在库存不足或已售罄，请重新选择。', '提示', function(res) {
                    if (res.confirm) {
                        return
                    }
                })
                return
            }

        }

        if (this.data.isEditStatus || this.data.allCheckedValidProductsCount <= 0 || this.data.publishedCount > 0) {
            return;
        }

        if (this.data.isLogin) {
            let list = this.data.list || [];
            list = list.filter(function(product, index) {
                return product.isChecked;
            });
            /*判断是否混有梵豆商品*/
            let uvBeanProductCount = 0;
            for (let i = 0; i < list.length; i++) {
                if (list[i].product_category == "梵豆") {
                    uvBeanProductCount++;
                }
            }
            if (uvBeanProductCount > 0 && uvBeanProductCount < list.length) {
                common.showModal('梵豆兑换的商品需要单独结算。', '提示', function(res) {
                    if (res.confirm) {
                        return
                    }
                })
                return
            } else if (uvBeanProductCount > 0 && uvBeanProductCount == list.length) {
                this.setData({
                    beanPay: "有梵豆商品"
                })
            }
            console.log(JSON.stringify(list));

            wx.navigateTo({
                url: '/pages/order-submit/order-submit?list=' + JSON.stringify(list) + '&beanPay=' + _this.data.beanPay,
            });
        } else {
            this.handleLoginPage();
        }
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
                    // that.pushToLoginPage();
                    that.setData({
                        isEditStatus: false,
                        allCheckedValidProductsCount: 0
                    })
                    wx.navigateTo({
                        url: '../me/twicelogin/twicelogin',
                    });
                    wx.setStorageSync("formWhere", "shopping");
                }
            },
            fail: function() {
                // Do nothing.
            },
        });
    },

    // Push To Login Page
    pushToLoginPage: function() {
        console.log('pushToLoginPage');
    },


    showAttr: function(e) {
        E = e

        productID = ''

        productAttr = ''
        oldInventory = 0
        const _this = this
        let id = e.target.dataset.id
        productID = e.target.dataset.id
        if (this.data.nowIndex != e.target.dataset.index) {
            this.setData({
                canConfirm: false,
                hiddenInventory: true,
                nowAttrID: [],
                nowAttrParentID: [],
                nowAttrCombineName: [],
                nowAttrName: [],
                dontNeedToAdd: false
            })
        } else {
            this.setData({
                dontNeedToAdd: true
            })
        }
        this.setData({

            isTap: true,
            isTapAttr: true,

            caculatePrice: "",
            num: 1,
            nowProductCate: e.target.dataset.cate,
            nowIndex: e.target.dataset.index,
        })
        var indexdata = {

            "productId": id

        }
        // api.get('/lr/s2bapi/productdetails2', indexdata)
        GetProductDetail_2(indexdata)
            .then(function(res) {
                console.log(res)
                if (res.code == 200) {
                    _this.loadingProductInfoFn(res)

                }
            })
    },
    hiddenAttr: function() {
        this.setData({
            isTap: false,
            isTapAttr: false
        })
    },
    loadingProductInfoFn: function(res) {
        const _this = this
        let thisData = JSON.parse(res.data.detailJson)
        let thisData2 = res.data
        console.log(thisData.ProductPrice)
        debugger
        _this.setData({
            F_MianImageList: thisData2.F_MianImageList,
            PictureModeList: thisData2.PictureModeList,
            imgURL: ((thisData2.F_MianImageList === null || thisData2.F_MianImageList == "") && thisData2.PictureModeList === null) ? thisData.PictureModels : (thisData2.PictureModeList === null ? (thisData2.F_MianImageList).split(',') : thisData2.PictureModeList),
            productName: thisData.Name,

            productAttributes: thisData.ProductAttributes,
            ProductAttributeCombinationModel: thisData.ProductAttributeCombinationModel,
            // caculatePrice: thisData.ProductPrice.Price.substr(1, thisData.ProductPrice.Price.length - 4)
            caculatePrice: thisData.ProductPrice.PriceValue
        })

        console.log(JSON.stringify(_this.data.productAttributes));
        for (let i = 0; i < thisData.ProductAttributes.length; i++) {
            let arrZore = ['0']
            let arrAttrName = [thisData.ProductAttributes[i].Name]
            _this.setData({
                nowAttrID: _this.data.dontNeedToAdd ? _this.data.nowAttrID : _this.addGoods(_this.data.nowAttrID, arrZore),
                nowAttrParentID: _this.data.dontNeedToAdd ? _this.data.nowAttrParentID : _this.addGoods(_this.data.nowAttrParentID, arrZore),
                nowAttrName: _this.data.dontNeedToAdd ? _this.data.nowAttrName : _this.addGoods(_this.data.nowAttrName, arrAttrName),
                nowAttrCombineName: _this.data.dontNeedToAdd ? _this.data.nowAttrCombineName : _this.addGoods(_this.data.nowAttrCombineName, arrZore)
            })
        }
    },
    // 选择规格

    selectAttr(e) {
        let _nowParnetIndex = e.currentTarget.dataset.parentindex; //当前点击的规格父级索引
        let _nowAttrID = e.currentTarget.dataset.id; //当前点击的规格ID
        let _nowAttrParentID = e.currentTarget.dataset.parentid; //当前点击的规格父级ID
        let _nowAttrCombineName = e.currentTarget.dataset.combinename; //当前点击的父级名称+规格名称
        let _nowAttrName = e.currentTarget.dataset.name; //当前点击的规格的名称

        let __nowAttrID = this.data.nowAttrID
        let __nowAttrParentID = this.data.nowAttrParentID
        let __nowAttrCombineName = this.data.nowAttrCombineName
        let __nowAttrName = this.data.nowAttrName

        __nowAttrID.splice(_nowParnetIndex, 1, _nowAttrID),
        __nowAttrParentID.splice(_nowParnetIndex, 1, _nowAttrParentID),
        __nowAttrCombineName.splice(_nowParnetIndex, 1, _nowAttrCombineName)
        __nowAttrName.splice(_nowParnetIndex, 1, _nowAttrName)

        this.setData({
            nowAttrID: __nowAttrID,
            nowAttrParentID: __nowAttrParentID,
            nowAttrCombineName: __nowAttrCombineName,
            nowAttrName: __nowAttrName
        })
        console.log(this.data.nowAttrID)
        console.log(this.data.nowAttrParentID)
        console.log(this.data.nowAttrCombineName)
        console.log(this.data.nowAttrName)
        let nowAttrCombineNameArr = Object.assign([], this.data.nowAttrCombineName);
        let differentCount = 0;
        for (let i = 0; i < this.data.ProductAttributeCombinationModel.length; i++) {
            let combinationAttributes = this.data.ProductAttributeCombinationModel[i].AttributesXml.split('<br />').toString() //将数据中的组合字符串去掉'<br />',再转成字符串与当前选择的组合进行对比
            if (nowAttrCombineNameArr.toString() == combinationAttributes) { //对比一致则打印该组合的信息
                console.log("当前规格组合：" + this.data.ProductAttributeCombinationModel[i].AttributesXml)
                console.log("当前规格组合ID：" + this.data.ProductAttributeCombinationModel[i].Id)
                console.log("当前规格组合价格：" + this.data.ProductAttributeCombinationModel[i].OverriddenPrice)
                console.log("当前规格组合库存：" + this.data.ProductAttributeCombinationModel[i].StockQuantity)
                console.log("当前规格组合SKU：" + this.data.ProductAttributeCombinationModel[i].Sku)
                console.log("当前规格组合发货周期：" + this.data.ProductAttributeCombinationModel[i].DeliveryCycle)
                this.setData({
                    hiddenInventory: false,
                    caculatePrice: this.data.ProductAttributeCombinationModel[i].OverriddenPrice,
                    unitPrice: this.data.ProductAttributeCombinationModel[i].OverriddenPrice,
                    Inventory: this.data.ProductAttributeCombinationModel[i].StockQuantity,
                    DeliveryCycle: this.data.ProductAttributeCombinationModel[i].DeliveryCycle,
                    nowCombinationID: this.data.ProductAttributeCombinationModel[i].Id,
                    nowCombinationName: combinationAttributes
                })
                break
            } else if (nowAttrCombineNameArr.indexOf("0") < 0 && nowAttrCombineNameArr.toString() != combinationAttributes) {
                //当每类规格都选完，且不存在于所有组合中的，用一个计数器记录
                differentCount++
            }
        }
        if (nowAttrCombineNameArr.indexOf("0") < 0) {
            this.setData({
                canConfirm: true,
                hasCombination: true,
                priceChange: true,
                hiddenInventory: false
            })
            if (differentCount == this.data.ProductAttributeCombinationModel.length) {
                this.setData({
                    hasCombination: false
                })
            }
        }

    },

    confirm: function() {
        if (this.data.isShowLoading) {
            return
        }
        this.hiddenAttr()
        const _this = this
        if (!this.data.hasCombination) {
            common.showModal('暂时无该组合。', '提示', function(res) {
                if (res.confirm) {
                    return
                }
            })
            return
        }
        if (this.data.num > this.data.Inventory) {
            common.showModal('输入数量大于现有库存或库存不足。', '提示', function(res) {
                if (res.confirm) {
                    return
                }
            })
            return
        }
        // if (this.data.finishChooseAttr) {
        // console.log(E)
        this.setData({
            fromConfirm: true
        })
        // _this.deleteProduct(E)
        // let thisgoods = {
        //   product_id: productID,
        //   combination_id: PACMID,
        //   product_price: parseInt((this.data.caculatePrice).split(',').join("")) / this.data.num,
        //   product_name: this.data.productName,
        //   product_specifications: productAttr,
        //   product_image: this.data.imgURL[0].ImageUrl,
        //   count: this.data.num
        // }
        // _this.fetchMyShoppingCart2(thisgoods);

        console.log('reviseProductAttributes');
        console.log(E)
        const dataset = E.currentTarget.dataset || {};
        const {index = 0} = dataset;
        let list = this.data.list || [];
        let product = list[index] || {};

        // if (+product.count <= 1) {
        //   return;
        // }

        if (!product.id) {
            // 有本地缓存, 即未上传(未登录)
            // 修改本地数据
            // product.count = +product.count - 1;
            // product.combination_id = PACMID
            console.log(index)
            product.combination_id = this.data.nowCombinationID
            product.product_specifications = this.data.nowCombinationName
            product.product_price = this.data.caculatePrice
            product.count = this.data.num
            product.product_category = "沙发"
            list[index] = product;
            updateShoppingCart({
                value: product
            }, index);
            debugger
            this.onChangedProucts(list);
        } else {
            console.log(product)
            let count = this.data.num
            // this.updateRemoteShoppingCart({ product, index, count: count - 1 });
            // if (product.combination_id == this.data.nowCombinationID) {
            //   count = product.count;
            // }
            this.updateRemoteShoppingCart({
                product,
                index,
                count: count,
                combination_id: this.data.nowCombinationID
            })

        }
        // }


    },
    confirm1: function() {
        common.showModal('请选择规格', '提示', function(res) {
            if (res.confirm) {
                return
            }
        })
    },
    //不分享
    giveUpShare: function() {
        this.setData({
            isTap2: false,
            showShareWin: false
        })
    },
    //未登录不允许分享
    canShare: function() {
        if (this.data.myToken == '') {
            wx.showModal({
                title: '提示',
                content: '请登录后再分享清单。',
                success: function(res) {
                    if (res.confirm) {
                        console.log('去登录')
                        wx.navigateTo({
                            url: '../me/twicelogin/twicelogin',
                        });
                        wx.setStorageSync("formWhere", "shopping");
                    } else if (res.cancel) {
                        console.log('不去登录')
                    }
                }
            })
        } else {
            let sharecartData = {
                "token": this.data.myToken,
                "loginMark": this.data.myPhone,
                "data": this.data.listChecked
            }
            // api.post('/lr/s2bapi/addsharecart', sharecartData, 'application/json')
            AddShareCart(sharecartData, 'application/json')
                .then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        this.setData({
                            shareListID: res.data.f_sscid,
                            showShareWin: true,
                            isTap2: true
                        })
                    }
                })
        }
    },
    //分享清单
    onShareAppMessage: function(res) {
        let nickname = wx.getStorageSync('userName') || " "
        let openid = wx.getStorageSync('openid')
        let invitationID = common.uuid()

        const _this = this
        if (res.from === 'button') {
            //用户未授权的话，nickName传空格字符串
            wx.getUserInfo({
                success: function(res) {
                    console.log(res)
                    nickname = res.userInfo.nickName
                    common.commonShare('购物清单', nickname, openid, false, invitationID, '')
                },
                fail: function(err) {
                    console.log(err)
                    common.commonShare('购物清单', nickname, openid, false, invitationID, '')
                }
            })
        }
        return {
            title: '马上收取购物清单',
            path: '/pages/shopping-cart/shopping-cart?fromsharelist=true&sharelistid=' + this.data.shareListID,
            imageUrl: 'https://uvpt.uvanart.com/upload/static/shoppingList.png',
            success: function(res) {
                wx.showToast({
                    title: '分享清单成功',
                    icon: 'success',
                    duration: 1500
                });
                _this.setData({
                    isTap2: false,
                    showShareWin: false
                })
            },
            fail: function(res) {
                _this.setData({
                    isTap2: false,
                    showShareWin: false
                })
            }
        }
    },
    //获取分享清单的商品
    getShareList: function() {
        if (this.data.canClickGetShare == false) {
            return
        }
        this.setData({
            canClickGetShare: false
        })
        const _this = this
        if (this.data.myToken == '') {
            this.setData({
                isTap2: false,
                hasShareList: false,
            })
            //未登录存缓存
            let sharelistData = {
                "f_sscid": this.data.shareListID
            }
            // api.get('/lr/s2bapi/getshareshopcartdetails', sharelistData)
            GetShareshoppingCartdetails(sharelistData)
                .then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        let product = res.data
                        for (let i = 0; i < product.length; i++) {
                            insertShoppingCart({
                                value: product[i],
                                success: function() {},
                            });
                        }
                        this.fetchMyShoppingCart();
                        this.setData({
                            canClickGetShare: true
                        })
                        wx.showToast({
                            title: '成功添加清单',
                            icon: 'success',
                            duration: 1500
                        });
                    } else {
                        this.setData({
                            canClickGetShare: true
                        })
                    }
                })
        } else {
            this.setData({
                isTap2: false,
                hasShareList: false
            })
            //登录了插到后台
            let sharelistData = {
                // "token": this.data.myToken,
                "loginMark": this.data.myPhone,
                "f_sscid": this.data.shareListID
            }
            // api.get('/lr/s2bapi/ReceiveShoppingCart', sharelistData)
            ReceiveShoppingCart(sharelistData)
                .then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        //刷新购物车
                        this.fetchMyShoppingCart();
                        this.setData({
                            canClickGetShare: true
                        })
                        wx.showToast({
                            title: '成功添加清单',
                            icon: 'success',
                            duration: 1500
                        });
                    } else {
                        this.setData({
                            canClickGetShare: true
                        })
                    }
                })
        }
    },
    //放弃获取分享清单
    giveUpShareList: function() {
        this.setData({
            isTap2: false,
            hasShareList: false
        })
    },
    addGoods: function(goodsList, resData) {
        var length = goodsList.length
        for (let i = 0; i < resData.length; i++) {
            goodsList[i + length] = resData[i]
        }
        return goodsList
    },


    /* minus or plus*/
    bindMinus: function() {
        var num = this.data.num
        if (num > 1) {
            num--
        }
        var minusStatus = num <= 1 ? 'disabled' : 'normal'
        this.setData({
            num: num,
            minusStatus: minusStatus,
            caculatePrice: this.data.unitPrice * num
        })

    },
    bindPlus: function() {
        var num = this.data.num
        if (num < 999) {
            num++
        }
        var minusStatus = num < 1 ? 'disabled' : 'normal'
        this.setData({
            num: num,
            minusStatus: minusStatus,
            caculatePrice: this.data.unitPrice * num
        })
    },
    bindManual: function(e) {
        var num = e.detail.value
        var minusStatus = num <= 1 ? 'disabled' : 'normal'
        if (num == '') {
            num = ''
        } else if (num <= 0) {
            num = 1
        } else if (num >= 999) {
            num = 999
        }
        this.setData({
            num: num,
            minusStatus: minusStatus,
            caculatePrice: this.data.unitPrice * num
        })

    },
    bindblur2: function(e) {
        if (e.detail.value == '') {
            this.setData({
                num: 1
            })
        }
    }
})