export default class AddAutoPlugin {
  apply(compiler) {
    // 使用更早的阶段确保能捕获所有资源
    const stage = compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS;

    compiler.hooks.thisCompilation.tap('AddAutoPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'AddAutoPlugin',
          stage: stage
        },
        (assets) => {
          const { RawSource } = compiler.webpack.sources;

          Object.keys(assets).forEach((filename) => {
            if (!filename.endsWith('.js')) return;

            try {
              const asset = compilation.getAsset(filename);
              const content = asset.source.source().toString();
              
              compilation.updateAsset(
                filename,
                new RawSource(`'auto';\n${content}`),
                {
                  minimized: asset.info.minimized || false
                }
              );
            } catch (err) {
              compilation.errors.push(new Error(`AddAutoPlugin error with ${filename}: ${err}`));
            }
          });
        }
      );
    });
  }
}
