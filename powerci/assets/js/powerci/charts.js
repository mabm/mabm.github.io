/* ------------------------------------------------------------------------------
 *
 *  # Echarts - lines and areas
 *
 *  Lines and areas chart configurations
 *
 *  Version: 1.0
 *  Latest update: August 1, 2015
 *
 * ---------------------------------------------------------------------------- */

function generateGraph(config) {
    var i = 0;
    var cat = Array();
    $.each(config.data, function(i, elem) {
        var local = {name: '', data: Array()};
        local.name = elem.legend
        i = 0;
        while (i < elem.tabSize) {
            local.data.push(elem.data[i++]);
        }
        cat.push(local);
    });
   $(config.obj).highcharts({
        exporting: {
            allowHTML: true,
            enabled: true,
            filename: 'powerci_chart_' + config.suffixFilename,
            scale: 0,
            sourceWidth: 2000,
            sourceHeight: 800
        },
        chart: {
                zoomType: 'x',
                type: config.type
                //type: 'area'
            },
        title: {
            text: config.title,
            x: -20 //center
        },
        xAxis: {
            titles: {
                text: config.xUnit
            },
            categories: config.categories
        },
        yAxis: {
            title: {
                text: config.yUnit
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: config.valueSuffix
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: cat
    });
}
