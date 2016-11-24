'use strict'

var entities = require('entities');
var util = require('hexo-util');
var cheerio = require('cheerio');
var childProcess = require("child_process");

var cheerio_load_option = {
  decodeEntities: false
};

var options = {
  auto_detect: false,
  lang: 'plain',
  gutter: false,
  wrap: false
};

/**
 * data has text/path/toString
 */
function renderer(data, locals) {
  var filePath = data.path;

  // FIXME: Windows?
  var relativePath = /^(.*)\/(source\/.*?)$/.exec(filePath)[2];

  // FIXME: Parametrize the command?
  var asciidoctorCommand = "asciidoctor -b html5 -o - -s -d book -r asciidoctor-diagram -D public/ " + relativePath;

  var html = childProcess.execSync(asciidoctorCommand, {
    encoding: 'utf-8'
  });

  var $ = cheerio.load(html, cheerio_load_option);

  /*
   * If we generate images, we will try to rewrite their absolute paths
   * so they function in the generated website correctly.
   *
   * Since AsciiDoctor interprets absolute paths as real absolute paths,
   * and doesn't allow us to configure a base `root` path, we target
   * here the docker run.
   *
   * If in the asciidoctor document you will have a generated image
   * pointing at: `/documents/public/images/img.png`, this will be
   * rewritten to point at `/images/img.png`.
   */
  // FIXME: parametrize the root path
  $('img').each(function(index, elem) {
    var imagePath = $(elem).attr("src");
    if (/^\/documents\/public\//.test(imagePath)) {
      imagePath = imagePath.substr('/documents/public'.length);
      $(elem).attr("src", imagePath);
    }
  });

  /*
   * For highlighing code, we're using the same settings as
   * `hexo-renderer-asciidoc` and we're not doing the rendering with
   * `asciidoctor`.
   */
  $('.highlight code').each(function(index, elem) {
    options.lang = elem.attribs['data-lang'];
    var code = entities.decodeXML($(elem).text());
    var content = util.highlight(code, options);
    $(elem).html(content);
  });

  return $.html()
             .replace(/{/g, '&#123;')
             .replace(/}/g, '&#125;');
}

hexo.extend.renderer.register('ad', 'html', renderer, true);
hexo.extend.renderer.register('adoc', 'html', renderer, true);
hexo.extend.renderer.register('asciidoc', 'html', renderer, true);

