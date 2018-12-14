import Cookies from 'js-cookie'


export const setCookies = (key, value) => {
    Cookies.set(key, value, { expires: 1 })  // 默认1天保存
}

export const getCookies = key => {
    let val = Cookies.get(key)

    if(val) return val
    else return false
}

export const removeCookies = key => {
    if(key) Cookies.remove(key)
    else return false
}