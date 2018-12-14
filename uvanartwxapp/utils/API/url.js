const env = "test";
const host = (env == "test") ? 'https://wxapp.uvanart.com' : 'https://s2bapi2.uvanart.com';  //https://philip.uvanart.com
// const host = (env == "test1"). ? 'https://hks2b.uvanart.com.' : 'https://s2bapi.uvanart.com';.
//              const host = (env == "test") ? 'http://10.1.43.240:31173' : 'https://s2bapi.uvanart.com'; //俊总.
// const host = (env == "test") ? 'http://192.168.2.183:8080' : 'https://s2bapi.uvanart.com'; //白兰地
//const host = (env == "test") ? 'https://philip.uvanart.com' : 'https://s2bapi.uvanart.com'; //白兰地

module.exports ={
    host
}           