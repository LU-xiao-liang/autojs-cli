import AddAutoPlugin from './plugins/addAuto.plugin.js';

export default {
    output: {
        filename: 'main.js',
        clean: true,
    },
    plugins: [
        new AddAutoPlugin(),
    ]
}
