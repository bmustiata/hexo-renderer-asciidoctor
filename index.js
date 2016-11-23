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
  var asciidoctorCommand = "asciidoctor -b html5 -o - -s -d book -r asciidoctor-diagram " + relativePath;

  var html = childProcess.execSync(asciidoctorCommand, {
    encoding: 'utf-8'
  });

  var $ = cheerio.load(html, cheerio_load_option);

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

