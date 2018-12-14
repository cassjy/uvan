export function handleCodeLoading(vue, code, data) {
  switch (code) {
    case 408:
      vue.$vux.loading.hide();
      vue.$vux.toast.show({
        text: "网络请求超时",
        type: "text",
        width: "10em"
      });
      break;
    case 500:
      break;
      vue.$vux.loading.hide();
      vue.$vux.toast.show({
        text: data.data.msg,
        type: "text",
        width: "10em"
      });
    default:
      break;
  }
}
