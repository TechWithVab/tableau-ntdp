var viz, workbook, liveDashboard, tickerSheet, i=0, j=0, tt;
var activeSheet, worksheetArray;  // remove this, todo

//read from underlying data, todo

var category_filter = ["Furniture", "Office Supplies", "Technology", "All"];

function initViz() {
  var containerDiv = document.getElementById("vizContainer");
  var url = "https://public.tableau.com/views/TableauNewsTickerDynamicMonitor/Dashboard1";
  
  var options = {
    hideTabs: true,
    hideToolbar: true,
    toolbar: 'no',
    width: containerDiv.offsetWidth,
    height: containerDiv.offsetHeight,
    // "Sector": "Motor",
    // "Change by View" : "LV",
    onFirstInteractive: function () {
      workbook = viz.getWorkbook();
      liveDashboard = workbook.getActiveSheet().getWorksheets()[0];
      tickerSheet = workbook.getActiveSheet().getWorksheets()[1];
      
      console.log("Ticker Sheet: "+tickerSheet.getName());
      console.log("Filter Sheet: "+liveDashboard.getName());


      // activeSheet = workbook.getActiveSheet();
      // if (activeSheet.getSheetType() === 'worksheet') {
      //   // It is a single sheet
      // }
      // else {  // active sheet type is Dashboard
      //   worksheetArray = activeSheet.getWorksheets();
      //   for (var i = 0; i<worksheetArray.length; i++) {
      //     //alert("3work man!");
      //     console.log(worksheetArray[i].getName());
      //   }
      // }

      loopCharts();
      getTickerData();

    }
  };

  viz = new tableau.Viz(containerDiv, url, options); 
}
// Stats animation by changing filters

// Stats animation by changing filters
function loopCharts() {
  
  i = category_filter.length - 1;

  function start() {
      $('#start').attr("disabled", true);
      $('#stop').attr("disabled", false);
      looper = setInterval(function() {
      i++;                 
      if (i == (category_filter.length) ) {
        i=0;
      }
      changeFilter("Category", category_filter[i]);
    }, 4000);
  };

  function stop() {
    $('#stop').attr("disabled", true);
    $('#start').attr("disabled", false);
    clearInterval(looper);
  };

  function prev() {
    $('#stop').attr("disabled", true);
    $('#start').attr("disabled", false);
    clearInterval(looper);
      if(i==0){
        i = category_filter.length - 1;
      }
      else{
        i--;
      }
    changeFilter("Metric Name", category_filter[i]);
  }

  function next() {
    $('#stop').attr("disabled", true);
    $('#start').attr("disabled", false);
    clearInterval(looper);
      if(i==category_filter.length - 1){
        i = 0;
      }
      else{
        i++;
      }
    changeFilter("Metric Name", category_filter[i]);
  }

  $('#start').bind("click", start); // use .on in jQuery 1.7+
  $('#stop').bind("click", stop);
  $('#prev').bind("click", prev);
  $('#next').bind("click", next);

  start();  // if you want it to auto-start

}

// Generates HTML for ticker
function tickerBody(d){

  tt = '';
  tt = '<marquee behavior="scroll" direction="left" onmouseover="this.stop();" onmouseout="this.start();">';
  for (var r=0; r < d.length; r=r+4){

    if(d[r][1].formattedValue == 'Null') continue;

    var category = d[r][0].formattedValue;
    var pct_sales = ((d[r][2].value)*100).toFixed(2); //ni pct
    var pct_profit = ((d[r+2][2].value)*100).toFixed(2); //to pct
    var val_sales = abbrNum(d[r+1][2].value); //ni val
    var val_profit = abbrNum(d[r+3][2].value);
    var metricName = '';
    if(d[r][0].formattedValue == 'Transaction Value')
      metricName = 'Tx Val';
    else
      metricName = 'Tx Vol';

    tt += '<div class="item">';
    tt += '<div class="desc"><div class="value">'+category+'</div></div>'; // value, description closed

    // daily info
    tt += '<div class="info"><div class="heading">Sales YTD</div><div class="value"><span class="actual">'+val_sales+'</span></div></div>';  // Info, Value closed
    tt += '<div class="info pct"><div class="heading">vs PY</div><div class="value">';
    if(pct_sales >= 0)
      tt += '<span class="green">&#9650; '+pct_sales+'%</span>';
    else 
      tt += '<span class="red">&#9660; '+pct_sales*-1+'%</span>';
    tt += '</div></div>'; // Value, Info closed

    // monthly info
    tt += '<div class="info"><div class="heading">Profit YTD</div><div class="value"><span class="actual">'+val_profit+'</span></div></div>';  // Info, Value closed
    tt += '<div class="info pct"><div class="heading">vs PY</div><div class="value">';
    if(pct_profit >= 0)
      tt += '<span class="green">&#9650; '+pct_profit+'%</span>';
    else 
      tt += '<span class="red">&#9660; '+pct_profit*-1+'%</span>';
    tt += '</div></div>'; // Value, Info closed

    tt += '</div>'; // Item closed

  }
   tt += '</marquee>';
   $("#statsTicker").html(tt);
}

// Gets Data from Tableau Sheet 'TickerCross'
function getTickerData(){
  var tickerOptions = {
    maxRows: 0, // Max rows to return. Use 0 to return all rows
    ignoreAliases: false,
    ignoreSelection: true,
    includeAllColumns: false
  };
  tickerSheet.getSummaryDataAsync(tickerOptions).then(function(t){
    console.log(t.getData());
    tickerBody(t.getData());
  });
}

// Changes filter on a sheet in dashboard
function changeFilter(name, value) {

  var sheet = liveDashboard; // todo: change with name
  if (value === "") {
    sheet.clearFilterAsync(name);
  }
  else if (value === "All") {

      sheet.applyFilterAsync(name, "", tableau.FilterUpdateType.ALL);
  }
  else {

      sheet.applyFilterAsync(name, value, tableau.FilterUpdateType.REPLACE);
  }
}

$(document).ready(function (){
  initViz();  
});


// Crunches number to string
function abbrNum(d){
  if(d >= 1000000000000) return( (d/1000000000000).toFixed(2) + 't');
  else if(d >= 1000000000) return( (d/1000000000).toFixed(2) + 'b');
  else if (d >= 1000000) return( (d/1000000).toFixed(2) + 'm');
  else if (d >= 1000) return( (d/1000).toFixed(2) + 'k');
  else return d
}
