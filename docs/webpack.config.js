const path = require('path');
const fs = require('fs');
const stencil = require('@stencil/webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const CDN_URL = process.env.DOCS_CDN_URL || '';

module.exports = {
  entry: {
    componentListing: './src/component-listing/app.js',
    componentViewer: './src/component-viewer/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: CDN_URL,
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'less-loader' // compiles Less to CSS
          }
        ]
      },
      {
        test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    fallback: {
      crypto: false
    }
  },
  plugins: [
    new MonacoWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/index.html',
          to: '[name][ext]',
          transform: injectCdnUrl
        },
        { from: '../dist/genesys-webcomponents/**/*' },
        {
          from: '../src/components/**/example.html',
          to: ({ context, absoluteFilename }) => {
            const segments = absoluteFilename.split(path.sep);
            const component = segments[segments.length - 2];
            return `${component}.html`;
          },
          transform: generateComponentPage
        },
        {
          from: '../src/style/examples/*.html',
          to: ({ context, absoluteFilename }) => {
            return path.basename(absoluteFilename);
          },
          transform: generateComponentPage
        }
      ]
    })
  ],
  // devServer: {
  //   compress: true,
  //   port: 8080,
  //   serveIndex: true,
  //   disableHostCheck: true,
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  //     'Access-Control-Allow-Headers':
  //       'X-Requested-With, content-type, Authorization'
  //   }
  // }

  devServer: {
    compress: true,
    port: 8080,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization'
    },
    static: {
      serveIndex: true
    }
  }
};

const componentPageTemplate = fs
  .readFileSync('src/viewer-template.html')
  .toString();

function generateComponentPage(exampleMarkup) {
  const withCdn = injectCdnUrl(componentPageTemplate);
  const sanitizedMarkup = exampleMarkup.toString().replace(/`/g, '\\`');
  let withHtml = withCdn.replace('${EXAMPLE_HTML}', sanitizedMarkup);

  if (withHtml.includes('${SPARK_ICON_EXAMPLE_LIST}')) {
    const iconScript = require('./src/utils/generateIcons');
    const iconsExamplesHtml = iconScript.generateHTML();
    withHtml = withHtml.replace(
      '${SPARK_ICON_EXAMPLE_LIST}',
      iconsExamplesHtml
    );
  }

  if (withHtml.includes('${LEGACY_ICON_EXAMPLE_LIST}')) {
    const iconScript = require('./src/utils/generateLegacyIcons');
    const iconsExamplesHtml = iconScript.generateHTML(
      '../src/components/stable/gux-icon/icons/legacy'
    );
    withHtml = withHtml.replace(
      '${LEGACY_ICON_EXAMPLE_LIST}',
      iconsExamplesHtml
    );
  }

  return withHtml;
}

function injectCdnUrl(content) {
  let htmlCdnUrl = CDN_URL;
  if (htmlCdnUrl.length > 0 && !htmlCdnUrl.endsWith('/')) {
    htmlCdnUrl = htmlCdnUrl + '/';
  }
  return content.toString().replace(/\$\{CDN_URL\}/g, htmlCdnUrl);
}
