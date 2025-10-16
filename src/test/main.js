
// 获取root权限
shell('adb root', true);
console.log('adb root');

shell('adb tcpip 5555', true);
console.log('adb tcpip 5555');