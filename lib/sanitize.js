
var replace_urls = exports.replace_urls = function (text) {
  text = text.replace(/<a\b[^>]*title="([^>]+)"[^>]*>[^<\/a>]<\/a\b>/, '$1');
  text = text.replace('…', '');
  return text.replace('&nbsp;', '')
};

var filter_html = exports.filter_html = function (text) {
  text = text.replace(/<[^>]*>/gm, '');
  text = text.replace(/\s+/gm, ' ');
  return text.replace(/\t/gm, '');
};

exports.sanitize = function (text) {
  return filter_html(replace_urls(text))
}