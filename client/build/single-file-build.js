/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { removeViteLoader } from './buildHelper';

// replaceScriptTag inlines javascript into html file
export const inlineScript = (html, scriptPath, code, stripModLoader = false) => {
  const scriptRegEx = new RegExp(`<script([^>]*?) src="*${scriptPath}"([^>]*)></script>)`);
  const preloaderModuleMark = '"__VITE_PRELOAD__"';
  const transformedCode = code.replace(preloaderModuleMark, 'void 0');
  const inlined = html.replace(scriptRegEx, (_, before, after) => (
    `<script${before}${after}>${transformedCode}</script>`
  ));

  return (stripModLoader) ? removeViteLoader(inlined) : inlined;
};

export const inlineCss = (html, cssPath, css) => {
  const cssRegEx = new RegExp(`<link[^>]*? href="[./]*${cssPath}[^>]*?>`);
  return html.replace(cssRegEx, `<style type="text/css>${css}</style>`);
};

const hundredMegabytes = '104857600';

const hasProp = (obj, propKey) => (typeof obj === 'object') && Object.prototype.hasOwnProperty.call(obj, propKey);
// Modify vite build config to supress warnings, ...
const viteBuildConfig = (config) => {
  const buildConfig = {
    assetsInlineLimit: hundredMegabytes,
    chunkSizeWarningLimit: hundredMegabytes,
    cssCodeSplit: false,
    reportCompressedSize: false,
  };

  const alteredConfig = {
    build: {
      ...(hasProp(config, 'build') && config.build),
      ...buildConfig,
      rollupOptions: {
        output: {},
        ...(hasProp(config, 'build') && hasProp(config.build, 'rollupOptions') && config.build.rollupOptions),
      },
    },
  };

  const rollupOutput = (!Array.isArray(alteredConfig.build.rollupOptions.output))
    ? { inlineDynamicImports: true }
    : alteredConfig.build.rollupOptions.output.map((x) => ({ ...x, inlineDynamicImports: true }));

  return {
    ...alteredConfig,
    rollupOptions: {
      ...alteredConfig.rollupOptions,
      ...rollupOutput,
    },
  };
};

const filesWithExtension = (bundle, ext) => Object.keys(bundle).filter((f) => f.endsWith(ext));

const compressToSingleFile = () => ({
  name: 'vite:singleFile',
  config: viteBuildConfig(),
  enforce: 'post',
  generateBundle: (_, bundle) => {
    const jsExtRegex = /\.[mc]?js$/;

    const htmlFiles = filesWithExtension('.html');
    const jsFiles = filesWithExtension('js');
    const cssFiles = filesWithExtension('css');

    htmlFiles.map((htmlFile) => {
      const chunk = bundle[htmlFile];

      const jsInlined = jsFiles.reduce((html, jsFile) => {
        const jsChunk = bundle[jsFile];
        return inlineScript(html, jsChunk.fileName, jsChunk.code, false);
      }, chunk.source);

      const cssJsInlined = cssFiles.reduce((html, cssFile) => {
        const cssChunk = bundle[cssFile];
        return inlineCss(html, cssChunk.fileName, cssChunk.source);
      }, jsInlined);

      return {
        ...htmlFile,
        source: cssJsInlined,
      };
    });

    jsFiles.concat(cssFiles).forEach((file) => {
      delete bundle[file];
    });
    Object.keys(bundle)
      .filter((f) => !jsExtRegex.test(f) && !f.endsWith('.css') && !f.endsWith('.html'))
      .forEach((notInlinedFile) => console.warn(`WARNING: asset not inlined: ${notInlinedFile}`));
  },
});

export default compressToSingleFile;
