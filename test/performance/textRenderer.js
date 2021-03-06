$(document).ready(function () {
  var suite = new Benchmark.Suite;

  $('<button id="runAll">Run all tests</button>').appendTo(document.body).click(function () {
    runAllTests();
  });

  /**
   * Prepare
   */

  $('<h1>Tests</h1>').appendTo(document.body);

  $('<div id="example1"></div>').appendTo(document.body).handsontable({
    data: [
      ['test']
    ],
    columns: [
      {
        type: 'text'
      }
    ],
    asyncRendering: false
  });

  $('<div id="example2"></div>').appendTo(document.body).handsontable({
    data: [
      ['test']
    ],
    columns: [
      {
        type: 'autocomplete',
        source: ['test', 'test2', 'test3']
      }
    ],
    asyncRendering: false
  });

  $('<div id="example3" style=""></div>').appendTo(document.body).handsontable({
    startRows: 3,
    startCols: 3,
    asyncRendering: false
  });

  $('<div id="example4" style="width: 100px; height: 50px; overflow: scroll"></div>').appendTo(document.body).handsontable({
    startRows: 3,
    startCols: 3,
    asyncRendering: false
  });

  /**
   * Test suite
   */

  suite.add('textRenderer', function (/*deferred*/) {
    $("#example1").handsontable('render');
  });

  suite.add('autocompleteRenderer', function (/*deferred*/) {
    $("#example2").handsontable('render');
  });

  suite.add('overflow: none', function (/*deferred*/) {
    $("#example3").handsontable('render');
  });

  suite.add('overflow: scroll', function (/*deferred*/) {
    $("#example4").handsontable('render');
  });

  /**
   * Reporter
   */

  $('<h1>Test results</h1>').appendTo(document.body);

  var results = [];

  var reporter = $('<div id="reporter"></div>').appendTo(document.body).handsontable({
    data: results,
    columns: [
      {
        data: "name"
      },
      {
        data: "hz",
        type: "numeric",
        format: "0,0"
      },
      {
        data: "stats.rme", //The relative margin of error (expressed as a percentage of the mean).
        type: "numeric",
        format: "0.0"
      },
      {
        data: "stats.sample.length",
        type: "numeric"
      }
    ],
    colHeaders: ['Test name', 'Operations/sec', 'RME (%)', 'Runs'],
    asyncRendering: false
  });

  suite.on('cycle', function (event) {
    results.push(event.target);
    reporter.handsontable('render');
    var stringified = String(event.target).replace(/±/g, '+-');
    console.log(' - ', stringified/*, results*/);
  });

  suite.on('complete', function () {
    var total = 0;
    for (var i = 0, ilen = results.length; i < ilen; i++) {
      total += results[i].hz;
    }
    console.error("TOTAL SCORE:", numeral(total).format('0'));
  });

  function runAllTests() {
    console.log("Running all tests...");
    suite.run(/*{ 'defer': true }*/{async: true});
  }

  if (/phantom/i.test(navigator.userAgent)) {
    //This is PhantomJS. Start tests immediately
    runAllTests();
  }
});