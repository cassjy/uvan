export function letterFilter(value){
  return value.length>8?value.substring(0,8)+'...':value
}