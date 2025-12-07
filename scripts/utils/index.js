import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import config from 'config';
import chokidar from 'chokidar';
import logger from './logger.js';



/**
 * 获取某个文件夹下的所有文件夹名称
 * @param {string} folderPath 文件夹路径
 * @returns {string[]} 文件夹名称数组
 */
export function getFolderNames(folderPath) {
    const folderNames = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    return folderNames;
}

/**
 * 获取自动化脚本列表
 * @returns {string[]} 脚本名称数组
 */
export function getScriptNames() {
    const scriptNames = getFolderNames(path.resolve(process.cwd(), './src'));
    return scriptNames;
}


/**
 * 获取adb设备列表
 * @returns {string[]} 设备列表
 */
export function getAdbDeviceList() {
    const deviceList = execSync('adb devices').toString().trim().split('\n').slice(1);
    return deviceList;
}


/**
 * 把脚本推送到设备
 * @param {string} device 设备ID
 * @param {string} scriptName 脚本名称
 */
export function pushScriptToDevice(device, scriptName) {
    try {
        const distPath = path.resolve(process.cwd(), './dist/');
        const scriptPath = config.get('android.scriptPath');
        const targetDir = `${scriptPath}/${scriptName}`;

        // 先在设备上创建目录
        execSync(`adb -s ${device} shell mkdir -p "${targetDir}"`);

        // 清空目标目录
        execSync(`adb -s ${device} shell rm -rf "${targetDir}/*"`);

        // 读取dist目录下的所有文件和文件夹
        const items = fs.readdirSync(distPath);

        // 逐个推送文件和文件夹
        for (const item of items) {
            const itemPath = path.join(distPath, item);
            execSync(`adb -s ${device} push "${itemPath}" "${targetDir}/"`);
        }

    } catch (error) {
        throw `推送脚本 ${scriptName} 到设备 ${device} 失败: ${error.message}`;
    }
}

/**
 * 运行自动化脚本
 * @param {string} device 设备ID
 * @param {string} scriptName 脚本名称
 */
export function runScriptOnDevice(device, scriptName) {
    try {
        execSync(`adb -s ${device} shell am start -n ${config.get('android.packageName')}/${config.get('android.activityName')} -d file://${config.get('android.scriptPath')}/${scriptName}/main.js \ --es "action" "execute"`);
    } catch (error) {
        throw `在设备 ${device} 上运行脚本 ${scriptName} 失败: ${error.message}`;
    }
}

/**
 * 打包脚本
 * @param {string} scriptName 脚本名称
 */
export function bundleScript(scriptName) {
    try {
        const build = `npx webpack "${path.resolve(process.cwd(), `./src/${scriptName}/main.js`)}"`
        execSync(build);
    } catch (error) {
        throw `打包脚本 ${scriptName} 失败: ${error.message}`;
    }
}

// 监听脚本文件夹变化，变化后推送脚本到设备并运行
function runWatchScriptOnDevice(device, scriptName) {
    try {
        bundleScript(scriptName); // 打包脚本
        logger.info(`脚本 ${scriptName} 打包完成`);

        pushScriptToDevice(device, scriptName); // 推送脚本到设备
        logger.info(`脚本 ${scriptName} 推送完成`);

        runScriptOnDevice(device, scriptName);

    } catch (error) {
        logger.error(`执行脚本失败: ${error}`);
        throw error;
    }
}



/**
 * 监听脚本文件夹变化，变化后推送脚本到设备并运行
 * @param {string} device 设备ID
 * @param {string} scriptName 脚本名称
 */
export function watchScriptFolder(device, scriptName) {
    const watcher = chokidar.watch(path.resolve(process.cwd(), `./src/${scriptName}/`));
    watchLogcat(device, scriptName);

    watcher.on('change', (filePath) => {
        logger.info(`检测到文件 ${filePath} 变化`);
        try {
            runWatchScriptOnDevice(device, scriptName); // 运行脚本
        } catch (error) {
            logger.error(`执行 ${scriptName} 失败: ${error}`);
        }
    });
    watcher.on('add', (filePath) => {
        logger.info(`检测到文件 ${filePath} 新增`);
        try {
            runWatchScriptOnDevice(device, scriptName); // 运行脚本并监控日志
        } catch (error) {
            logger.error(`执行 ${scriptName} 失败: ${error}`);
        }
    });

    // 优雅退出
    process.on('SIGINT', () => {
        logger.info('正在退出...');

        watcher.close();
        process.exit();
    });

}


/**
 * 监控日志
 * @param {string} device 设备ID
 * @param {string} scriptName 脚本名称
 */
export function watchLogcat(device, scriptName) {
    try {
        // 清空日志缓存
        execSync(`adb -s ${device} logcat -c`);

        // 只监控 Console 标签的日志，这是 Auto.js 脚本输出的标签
        const logcat = spawn('adb', ['-s', device, 'logcat']);

        logcat.stdout.on('data', (data) => {
            const logText = data.toString().trim();
            if (logText) {
                // 进一步过滤，只显示包含脚本输出的日志
                const lines = logText.split('\n');
                lines.forEach(line => {
                    if (line.trim() && (
                        line.includes('Console') ||
                        line.includes('console.log') ||
                        line.includes('console.info') ||
                        line.includes('console.warn') ||
                        line.includes('console.error') ||
                        line.includes('toastLog') ||
                        line.includes('log(')
                    )) {
                        // 处理日志 获取GlobalConsole: 后面的部分
                        const consoleLine = line.split('GlobalConsole: ')[1];
                        if (!consoleLine) return;
                        logger.info(`[${device}:${scriptName}] ${consoleLine}`);
                    }
                });
            }
        });

        logcat.stderr.on('data', (data) => {
            const errorText = data.toString().trim();
            if (errorText) {
                logger.error(`[${device}:${scriptName}] ${errorText}`);
            }
        });

        // 处理进程退出
        logcat.on('close', (code) => {
            if (code !== 0) {
                logger.warn(`[${device}:${scriptName}] logcat 进程退出，退出码: ${code}`);
            }
        });

        return logcat;
    } catch (error) {
        throw `监控日志失败: ${error.message}`;
    }
}