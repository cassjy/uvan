
const StorageKeyMap = {
  // Uvanart平台登录Token,不使用AuthorizedToken,避免出现重名
  UvanartToken: "token",
  UvanartProductCategory: "UvanartProductCategory",
  ProductSearchRecords: "ProductSearchRecords",
  ShoppingCart: "ShoppingCart",
};


function handleSuccess() {
  console.log('handleSuccess');
}

function handleFailure(error) {
  console.warn(error);
}

function saveStorage({ key = "", value = {}, success = handleSuccess, failure = handleFailure }) {
  console.log('saveStorage', success, value);
  if (key != "" && value) {
    try {
      wx.setStorageSync(key, value);
      if (typeof success == 'function') {
        console.log('[ ' + key + ' ]存储成功.');
        success();
      }
    }
    catch (error) {
      // TODO: 处理本地数据存储失败.
      if (typeof failure == 'function') {
        console.log('[ ' + key + ' ]存储失败.');
        failure(error);
      }
    }
  }
}

function readStorage(key = "") {
  if (!!key) {
    let value;
    try {
      value = wx.getStorageSync(key);
      console.log('[ ' + key + ' ]读取成功.');
      return value;
    }
    catch (error) {
      console.log('[ ' + key + ' ]读取失败.');
      return undefined;
    }
  }
  else {
    console.log('key值不能为空.');
    return undefined;
  }
}

function saveUvanartToken({ value = "", success = handleSuccess, failure = handleFailure }) {
  console.log('saveUvanartToken', success);
  saveStorage({
    key: StorageKeyMap.UvanartToken,
    value,
    success,
    failure
  });
}

function readUvanartToken() {
  const value = readStorage(StorageKeyMap.UvanartToken);
  return value || "";
}

// 插入一条购物车数据
function insertShoppingCart({ value = {}, success = handleSuccess, failure = handleFailure }) {
  let carts = readShoppingCart();
  const index = carts.findIndex(function (val, idx) {
    return val.product_id == value.product_id && val.combination_id == value.combination_id;
  })
  if (index > -1) {
    let val = carts[index];
    let count = value.count || 1;
    val.count += count;
    carts[index] = val;
  } else {
    let count = value.count || 1;
    value.count = count;
    carts = carts.concat([value]);
  }

  saveStorage({
    key: StorageKeyMap.ShoppingCart,
    value: carts,
    success,
    failure
  });
}

// 更新购物车数据
function updateShoppingCart({ value = {}, success = handleSuccess, failure = handleFailure },i = '') {
  let carts = readShoppingCart();
  
  const index = carts.findIndex(function (val, idx) {
    return val.product_id == value.product_id && val.combination_id == value.combination_id;
  })
  console.log("index="+index)

  if (index > -1) {
    carts[index] = value;
    saveStorage({
      key: StorageKeyMap.ShoppingCart,
      value: carts,
      success,
      failure
    });
  } else {
    // 不存在, 不做处理.
    carts[i] = value;
    saveStorage({
      key: StorageKeyMap.ShoppingCart,
      value: carts,
      success,
      failure
    });
  }
}

function removeShoppingCart({ value = {}, success = handleSuccess, failure = handleFailure }) {
  let carts = readShoppingCart();
  carts = carts.filter(function (product, index) {
    return product.product_id != value.product_id || product.combination_id != value.combination_id;
  });
  saveStorage({
    key: StorageKeyMap.ShoppingCart,
    value: carts,
    success,
    failure
  });
}

function removeAllShoppingCart({success = handleSuccess, failure = handleFailure}) {
  saveStorage({
    key: StorageKeyMap.ShoppingCart,
    value: [],
    success,
    failure
  });
}

function readShoppingCart() {
  // debugger
  const value = readStorage(StorageKeyMap.ShoppingCart);
  return value || [];
}

module.exports = {
  saveUvanartToken,
  readUvanartToken,
  insertShoppingCart,
  updateShoppingCart,
  removeShoppingCart,
  removeAllShoppingCart,
  readShoppingCart,
};
