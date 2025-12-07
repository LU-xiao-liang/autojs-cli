import winston from 'winston'

// 控制台专用格式 - 优化中文显示
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        // 处理对象类型的消息
        let formattedMessage = message
        if (typeof message === 'object') {
            formattedMessage = JSON.stringify(message, (key, value) => {
                // 确保中文字符正确显示
                if (typeof value === 'string') {
                    return value
                }
                return value
            }, 2)
        }

        // 处理额外的元数据
        let metaString = ''
        if (Object.keys(meta).length > 0) {
            metaString = '\n' + JSON.stringify(meta, null, 2)
        }

        return `${timestamp} [${level}]: ${stack || formattedMessage}${metaString}`
    })
)

// 创建 Winston logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    transports: [
        // 控制台输出 - 使用优化的中文格式
        new winston.transports.Console({
            format: consoleFormat,
            handleExceptions: true,
            handleRejections: true
        })
    ]
})

export default logger