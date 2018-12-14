let ifipad
var ua = navigator.userAgent.toLowerCase();     
ua.match(/iPad/i)=="ipad"?ifipad= true: ifipad=false

export default ifipad