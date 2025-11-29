/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 66.66666666666667, "KoPercent": 33.333333333333336};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6666666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "POST /categories"], "isController": false}, {"data": [1.0, 500, 1500, "GET /books"], "isController": false}, {"data": [1.0, 500, 1500, "GET /categories-1"], "isController": false}, {"data": [1.0, 500, 1500, "GET /users-0"], "isController": false}, {"data": [1.0, 500, 1500, "GET /categories-0"], "isController": false}, {"data": [0.0, 500, 1500, "GET /users-1"], "isController": false}, {"data": [0.0, 500, 1500, "POST Java /auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "GET /books-0"], "isController": false}, {"data": [0.0, 500, 1500, "GET /loans"], "isController": false}, {"data": [1.0, 500, 1500, "GET /books-1"], "isController": false}, {"data": [0.0, 500, 1500, "POST Java /auth/register"], "isController": false}, {"data": [1.0, 500, 1500, "POST /books"], "isController": false}, {"data": [0.0, 500, 1500, "GET /users"], "isController": false}, {"data": [1.0, 500, 1500, "GET /categories"], "isController": false}, {"data": [1.0, 500, 1500, "GET /books/available"], "isController": false}, {"data": [1.0, 500, 1500, "GET Python /health"], "isController": false}, {"data": [1.0, 500, 1500, "GET /loans-0"], "isController": false}, {"data": [0.0, 500, 1500, "GET /loans-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90, 30, 33.333333333333336, 4.844444444444444, 2, 52, 4.0, 7.0, 8.0, 52.0, 22.65861027190332, 7.464359894259819, 4.68489386644008], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /categories", 5, 0, 0.0, 2.6, 2, 3, 3.0, 3.0, 3.0, 3.0, 1.2939958592132506, 0.20724152432712217, 0.24262422360248448], "isController": false}, {"data": ["GET /books", 5, 0, 0.0, 7.4, 6, 10, 7.0, 10.0, 10.0, 10.0, 1.2909888974954815, 0.6013688516653757, 0.4223450006454944], "isController": false}, {"data": ["GET /categories-1", 5, 0, 0.0, 4.4, 4, 5, 4.0, 5.0, 5.0, 5.0, 1.2929919834497026, 1.2374337341608481, 0.21844493470390483], "isController": false}, {"data": ["GET /users-0", 5, 0, 0.0, 2.2, 2, 3, 2.0, 3.0, 3.0, 3.0, 1.2939958592132506, 0.20092318517080746, 0.21103252782091098], "isController": false}, {"data": ["GET /categories-0", 5, 0, 0.0, 2.2, 2, 3, 2.0, 3.0, 3.0, 3.0, 1.2939958592132506, 0.20724152432712217, 0.2173508669772257], "isController": false}, {"data": ["GET /users-1", 5, 5, 100.0, 3.4, 3, 4, 3.0, 4.0, 4.0, 4.0, 1.2933264355923435, 0.20460828375581996, 0.21218636833936885], "isController": false}, {"data": ["POST Java /auth/login", 5, 5, 100.0, 5.8, 5, 8, 5.0, 8.0, 8.0, 8.0, 1.2906556530717603, 0.4789542462570986, 0.2419979349509551], "isController": false}, {"data": ["GET /books-0", 5, 0, 0.0, 2.4, 2, 3, 2.0, 3.0, 3.0, 3.0, 1.2926577042399172, 0.2007154052481903, 0.21081429356256465], "isController": false}, {"data": ["GET /loans", 5, 5, 100.0, 6.0, 5, 7, 6.0, 7.0, 7.0, 7.0, 1.2923235978288963, 0.40511315908503487, 0.4227816457741018], "isController": false}, {"data": ["GET /books-1", 5, 0, 0.0, 4.4, 4, 5, 4.0, 5.0, 5.0, 5.0, 1.2926577042399172, 0.4014308104963806, 0.21207665460186143], "isController": false}, {"data": ["POST Java /auth/register", 5, 5, 100.0, 16.2, 7, 52, 7.0, 52.0, 52.0, 52.0, 1.2748597654258031, 0.4730924910759816, 0.242771146736359], "isController": false}, {"data": ["POST /books", 5, 0, 0.0, 2.2, 2, 3, 2.0, 3.0, 3.0, 3.0, 1.2939958592132506, 0.20092318517080746, 0.2363058844461698], "isController": false}, {"data": ["GET /users", 5, 5, 100.0, 5.6, 5, 6, 6.0, 6.0, 6.0, 6.0, 1.2926577042399172, 0.40521789361427096, 0.4228909481644261], "isController": false}, {"data": ["GET /categories", 5, 0, 0.0, 7.0, 6, 8, 7.0, 8.0, 8.0, 8.0, 1.2919896640826873, 1.4433947028423773, 0.43528948643410853], "isController": false}, {"data": ["GET /books/available", 5, 0, 0.0, 4.6, 4, 5, 5.0, 5.0, 5.0, 5.0, 1.2926577042399172, 0.4014308104963806, 0.2234379039555326], "isController": false}, {"data": ["GET Python /health", 5, 0, 0.0, 4.8, 4, 5, 5.0, 5.0, 5.0, 5.0, 1.2916559028674761, 0.18290049405838285, 0.2119122965641953], "isController": false}, {"data": ["GET /loans-0", 5, 0, 0.0, 2.6, 2, 3, 3.0, 3.0, 3.0, 3.0, 1.29366106080207, 0.20087119987063387, 0.21097792690815007], "isController": false}, {"data": ["GET /loans-1", 5, 5, 100.0, 3.4, 3, 4, 3.0, 4.0, 4.0, 4.0, 1.2933264355923435, 0.20460828375581996, 0.21218636833936885], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403", 10, 33.333333333333336, 11.11111111111111], "isController": false}, {"data": ["403/Forbidden", 20, 66.66666666666667, 22.22222222222222], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90, 30, "403/Forbidden", 20, "403", 10, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET /users-1", 5, 5, "403/Forbidden", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Java /auth/login", 5, 5, "403", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET /loans", 5, 5, "403/Forbidden", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Java /auth/register", 5, 5, "403", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET /users", 5, 5, "403/Forbidden", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET /loans-1", 5, 5, "403/Forbidden", 5, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
