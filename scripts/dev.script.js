import inquirer from 'inquirer';
import logger from './utils/logger.js';
import { getScriptNames, getAdbDeviceList, watchScriptFolder } from './utils/index.js';

// 选择设备
async function selectDevice() {
    const adbDeviceList = getAdbDeviceList().map(device => device.split('\t')[0]);
    let device = null;

    // 检测是否有连接的设备
    if (adbDeviceList.length === 0) {
        console.log('没有连接的设备');
        process.exit(1);
    }

    // 检测是否只有一个设备
    if (adbDeviceList.length === 1) {
        device = adbDeviceList[0];
    } else {
        // 有多个设备，需要用户选择
        const deviceAnswers = await inquirer.prompt([
            {
                type: 'list',
                name: 'device',
                message: '请选择要运行的设备',
                choices: adbDeviceList.map(device => ({
                    name: device,
                    value: device
                }))
            }
        ]);
        device = deviceAnswers.device;
    }

    return device;
}

// 选择脚本
async function selectScript() {
    // 检测是否有连接的脚本
    const scriptNames = getScriptNames();
    let scriptName = null;
    if (scriptNames.length === 0) {
        console.log('没有连接的脚本');
        process.exit(1);
    }

    // 检测是否只有一个脚本
    if (scriptNames.length === 1) {
        scriptName = scriptNames[0];

    } else {
        // 有多个脚本，需要用户选择
        const scriptAnswers = await inquirer.prompt([
            {
                type: 'list',
                name: 'script',
                message: '请选择要运行的脚本',
                choices: scriptNames.map(script => ({
                    name: script,
                    value: script
                }))
            }
        ]);
        scriptName = scriptAnswers.script;
    }

    return scriptName;
}


// 主函数
async function main() {
    const device = await selectDevice();
    const scriptName = await selectScript();

    logger.info(`选择设备 ${device}`);
    logger.info(`选择脚本 ${scriptName}`);

    // 监听脚本文件夹变化
    watchScriptFolder(device, scriptName);
}
main();

