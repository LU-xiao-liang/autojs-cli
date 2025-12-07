export default class AddAutoPlugin {
  constructor() {
    console.log('AddAutoPlugin loaded');
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('AddAutoPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'AddAutoPlugin',
          stage: compilation.constructor.PROCESS_ASSETS_STAGE_REPORT
        },
        (assets) => {
          console.log('🔧 开始处理资源...');
          // 1. 遍历资源对象
          Object.entries(assets).forEach(([filename, asset]) => {
            if (filename.endsWith('.js')) {
              console.log(`🔄 正在处理: ${filename}`);
              // 2. 获取原始资源内容
              let source = asset.source();
              if (Buffer.isBuffer(source)) {
                source = source.toString();
              }
              // 3. 准备要添加的头部代码
              const banner = `/*! 插件自动添加 - 构建时间: ${new Date().toLocaleString()} */\n`;
              // 4. 关键步骤：使用 updateAsset API 更新资源
              compilation.updateAsset(
                filename,
                new compiler.webpack.sources.RawSource(banner + source) // 创建新的资源源
              );
              console.log(`✅ 已为 ${filename} 添加头部代码`);
            }
          });
          console.log('🎉 资源处理完成!');
        }
      );
    });
  }
}
