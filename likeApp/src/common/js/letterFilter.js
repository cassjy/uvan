export function letterFilter(value){
  return value.length>9?value.substring(0,9)+'...':value
}

export function priceFilter(value){
  return value.toFixed(2)
}