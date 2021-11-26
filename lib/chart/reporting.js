"use strict";

const value = require('../value');

let chartReportingFunctions = {

    bar(values$ArrayDictionary)
    {

        values$ArrayDictionary = value.sort.ArrayDictionary(values$ArrayDictionary, "home runs");

        let html$String = '';
        html$String +=
`
<script src="//www.amcharts.com/lib/4/core.js"></script>
<script src="//www.amcharts.com/lib/4/charts.js"></script>
<script src="//www.amcharts.com/lib/4/maps.js"></script>

<div id="chartdiv" style="width: 100%; height: 600px;"></div>

<script>
// Create chart instance
var chart = am4core.createFromConfig({
  "data": ${JSON.stringify(values$ArrayDictionary)},
  "xAxes": [{
    "type": "ValueAxis",
    "dataFields": {
      "value": "home runs",
    }
  }],
  "yAxes": [{
    "type": "CategoryAxis",
    "dataFields": {
      "category": "players",
    }
  }],
  "series": [
      {
    "type": "ColumnSeries",
    "dataFields": {
      "valueX": "home runs",
      "categoryY": "players"
    },
    "columns": {
      "stroke": "#43b8ff",
      "fill": "#5f93ff"
    }
  }]
}, "chartdiv", am4charts.XYChart);
</script>`;

        return html$String;
    }

};
module.exports = chartReportingFunctions;
