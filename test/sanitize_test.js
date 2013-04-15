var sanitize = require('../lib/sanitize');
var should = require('should');

var fixtures = [
  'Cool Github Resume generator: <a href="http://t.co/SXKXbF3QzA" dir="ltr" data-expanded-url="http://thenextweb.com/apps/2012/09/02/my-github-resume-generates-resume-github-account/" class="twitter-timeline-link" target="_blank" title="http://thenextweb.com/apps/2012/09/02/my-github-resume-generates-resume-github-account/" ><span class="invisible">http://</span><span class="js-display-url">thenextweb.com/apps/2012/09/0</span><span class="invisible">2/my-github-resume-generates-resume-github-account/</span><span class="tco-ellipsis"><span class="invisible">&nbsp;</span>…</span></a>'
, 'Google launches Public Alerts in Japan to provide information during tsunami, earthquake crises <a href="http://t.co/hsvZ3nKbYh" dir="ltr" data-expanded-url="http://tnw.co/10iWOSP" class="twitter-timeline-link" target="_blank" title="http://tnw.co/10iWOSP" ><span class="invisible">http://</span><span class="js-display-url">tnw.co/10iWOSP</span><span class="invisible"></span><span class="tco-ellipsis"><span class="invisible">&nbsp;</span></span></a>'
, 'Fornøyd med formuleringen: «vannfall på post-its som blir til en brukerhistorie av gangen»'
, 'Take a photo of yourself every time you commit <a href="/search?q=%23protip&amp;src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr" ><s>#</s><b>protip</b></a> <a href="https://t.co/tILok2G8ww" dir="ltr" data-expanded-url="https://coderwall.com/p/xlatfq" class="twitter-timeline-link" target="_blank" title="https://coderwall.com/p/xlatfq" ><span class="invisible">https://</span><span class="js-display-url">coderwall.com/p/xlatfq</span><span class="invisible"></span><span class="tco-ellipsis"><span class="invisible">&nbsp;</span></span></a> via <a href="/coderwall" class="twitter-atreply pretty-link" dir="ltr" ><s>@</s><b>coderwall</b></a>'
, 'Screenshot <a href="/folleso" class="twitter-atreply pretty-link" dir="ltr" ><s>@</s><b>folleso</b></a>’s SublimeText plugin for <a href="/search?q=%23scriptcs&amp;src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr" ><s>#</s><b>scriptcs</b></a> while viewing <a href="/johncoder" class="twitter-atreply pretty-link" dir="ltr" ><s>@</s><b>johncoder</b></a>’s <a href="/search?q=%23signalr&amp;src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr" ><s>#</s><b>signalr</b></a> live reloader script. :-) <a href="http://t.co/kr4uVX2L6E" class="twitter-timeline-link" data-pre-embedded="true" dir="ltr" >pic.twitter.com/kr4uVX2L6E</a>'
, 'Yes <a href="/kevinrose" class="twitter-atreply pretty-link" dir="ltr" ><s>@</s><b>kevinrose</b></a> lets do something!  I mean god we&#39;ll be married ;)'
, 'very interesting post on fear of false positives, <a href="/search?q=%23risk&amp;src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr" ><s>#</s><b>risk</b></a>: &quot;Zero Dark Thirty and Bayes’ theorem&quot; <a href="http://t.co/iS4UjVAb" dir="ltr" data-expanded-url="http://bit.ly/12MLuPj" class="twitter-timeline-link" target="_blank" title="http://bit.ly/12MLuPj" ><span class="invisible">http://</span><span class="js-display-url">bit.ly/12MLuPj</span><span class="invisible"></span><span class="tco-ellipsis"><span class="invisible">&nbsp;</span></span></a> h/t <a href="/researchpuzzler" class="twitter-atreply pretty-link" dir="ltr" ><s>@</s><b>researchpuzzler</b></a>'
, '“<a href="/rifforama" class="twitter-atreply pretty-link" dir="ltr" ><s>@</s><b>rifforama</b></a>: <a href="/NathanFillion" class="twitter-atreply pretty-link" dir="ltr" ><s>@</s><b>NathanFillion</b></a> 1st 5 minutes of a 1st date, spilled a full beer on her lap.”&#10;&#10;&quot;Let&#39;s get you out of those wet clothes.&quot;'
, 'A Sourcemapping UI just landed in Webkit! <a href="http://t.co/YmkuUxeOKO" dir="ltr" data-expanded-url="http://trac.webkit.org/changeset/144451" class="twitter-timeline-link" target="_blank" title="http://trac.webkit.org/changeset/144451" ><span class="invisible">http://</span><span class="js-display-url">trac.webkit.org/changeset/1444</span><span class="invisible">51</span><span class="tco-ellipsis"><span class="invisible">&nbsp;</span>…</span></a>'
]

var results = [
  'Cool Github Resume generator: http://thenextweb.com/apps/2012/09/02/my-github-resume-generates-resume-github-account/'
, 'Google launches Public Alerts in Japan to provide information during tsunami, earthquake crises http://tnw.co/10iWOSP'
, 'Fornøyd med formuleringen: «vannfall på post-its som blir til en brukerhistorie av gangen»'
, 'Take a photo of yourself every time you commit #protip https://coderwall.com/p/xlatfq via @coderwall'
, 'Screenshot @folleso’s SublimeText plugin for #scriptcs while viewing @johncoder’s #signalr live reloader script. :-) pic.twitter.com/kr4uVX2L6E'
, 'Yes @kevinrose lets do something! I mean god we&#39;ll be married ;)'
, 'very interesting post on fear of false positives, #risk: &quot;Zero Dark Thirty and Bayes’ theorem&quot; http://bit.ly/12MLuPj h/t @researchpuzzler'
, '“@rifforama: @NathanFillion 1st 5 minutes of a 1st date, spilled a full beer on her lap.”&#10;&#10;&quot;Let&#39;s get you out of those wet clothes.&quot;'
, 'A Sourcemapping UI just landed in Webkit! http://trac.webkit.org/changeset/144451'
];

describe("Sanitize data", function () {

  it("should remove a-tags and show full url, and remove HTML", function (done) {
    fixtures.forEach(function (e, i) {
      var tmp = sanitize.sanitize(e);
      tmp.trim().should.equal(results[i].trim());
    });
    done();
  });

});