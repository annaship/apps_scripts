
var backupfilename = "backupfile";

function copyToo(srcrange, dstrange) {
    var dstSS = dstrange.getSheet().getParent();
    var copiedsheet = srcrange.getSheet().copyTo(dstSS);
    copiedsheet.getRange(srcrange.getA1Notation()).copyTo(dstrange);
    dstSS.deleteSheet(copiedsheet);
}

// This is run only one time.
function init() {
  // Source
  var srcss = SpreadsheetApp.getActiveSheet();
  var range = srcss.getDataRange().getA1Notation();
  var srcrange = srcss.getRange(range);
  var srcsheetname = srcss.getName();

  // Destination
  var backupfile = DriveApp.getFilesByName(backupfilename);
  var dstid = backupfile.hasNext()
    ? backupfile.next().getId()
    : SpreadsheetApp.create(backupfilename).getId();
  var dstss = SpreadsheetApp.openById(dstid).getSheets()[0]
  var dstrange = dstss.getRange(range);
  dstss.setName(srcsheetname);

  copyToo(srcrange, dstrange);
  PropertiesService.getScriptProperties().setProperty('backupfileid', dstid);
  return dstid;
}

function onEditByTrigger(e) {
  
  // var columnNumber = 1; // If you want to retrieve the old values when the column "A" is edited, it's 1.
  var source = e.source;
  var range = e.range;
  var dstid = PropertiesService.getScriptProperties().getProperty('backupfileid');
  if (!dstid) {
    dstid = init();
  }
  var new_sheet = SpreadsheetApp.openById(dstid).getSheets()[0];
  // var dstrange = new_sheet.getRange(range);

  if(e.oldValue) {
    // e.range.offset(0,1).setValue(e.oldValue)
    // Update backup file
    new_sheet.getRange("A48").setValue("old:" + e.oldValue);
    new_sheet.getRange("A49").setValue("new: " + e.value);
    new_sheet.range = e.range
    new_sheet.getRange(range).offset(1,1).setValue(
      "CHANGE"
    );
  };

  // Update backup file
  // var range = e.source.getDataRange().getA1Notation();
  // var srcrange = e.source.getRange(range);
  // parseValues(values, new_sheet);
/*
  
  // range.setNote('Last modified: ' + new Date()); //TypeError: range.setNote is not a function	
  val_text = "JSON.stringify(e): " + JSON.stringify(e);
  //  + "; Active cells: " + range + "; Old: " + oldValue + "; New: " + currentValue;
  new_sheet.getRange("A45").setValue(val_text);
  if(e.oldValue) {
    e.range.offset(0,1).setValue(e.oldValue)
    new_sheet.getRange("A46").setValue(e.oldValue);
    new_sheet.getRange("A47").setValue(e.value);
    };

  var values_change = [
    // ["Old", "new"]
  ["Old: " + oldValue, "New: " + currentValue]
  ];

  var rangeNew = range;
  // new_sheet.getRange("A44:B44");
  // rangeNew.setValues(values_change); // TypeError: rangeNew.setValues is not a function	//TypeError: SpreadsheetApp.openById(...).getSheets(...)[0].setValue is not a function	

  //  make_changed_val
  // copyToo(srcrange, dstrange);
  */
}

// https://stackoverflow.com/questions/64730328/google-sheets-custom-script-iterate-through-a-range-and-print-values-in-a-determ
function parseValues(values, new_sheet) {
  for (var i in values) {
    var row = values[i];
    var column = 1;
    for (var j in row) {
      var value = row[j];
      // if (newValue !== oldValue) {
        // new_sheet.getRange(parseInt(i) + 1, column).setValue(i + column + " new:" + value);
        val_text = i + "_" + column + " new:" + value[0];
        // new_sheet.getRange("A45").setValue(val_text); // Exception: The number of rows in the data does not match the number of rows in the range. The data has 1 but the range has 43.	
        column++;
      // }
    }
  }
}


function make_changed_val() {
  return "Old: " + oldValue + "; New: " + currentValue;
    // SpreadsheetApp.getActiveSheet().getRange('F2').setValue('Hello');
}

/**
 * https://stackoverflow.com/questions/16089041/how-can-i-test-a-trigger-function-in-gas
 * Test function for Spreadsheet Form Submit trigger functions.
 * Loops through content of sheet, creating simulated Form Submit Events.
 *
 * Check for updates: https://stackoverflow.com/a/16089067/1677912
 *
 * See https://developers.google.com/apps-script/guides/triggers/events#google_sheets_events
 */
// function test_emailChange() {
//   var dataRange = SpreadsheetApp.getActiveSheet().getDataRange();
//   var data = dataRange.getValues();
//   var headers = data[0];
//   // Start at row 1, skipping headers in row 0
//   for (var row=42; row < data.length; row++) {
//     var e = {};
//     e.values = data[row].filter(Boolean);  // filter: https://stackoverflow.com/a/19888749
//     e.range = dataRange.offset(row,0,1,data[0].length);
//     e.namedValues = {};
//     // Loop through headers to create namedValues object
//     // NOTE: all namedValues are arrays.
//     for (var col=0; col<headers.length; col++) {
//       e.namedValues[headers[col]] = [data[row][col]];
//     }
//     // Pass the simulated event to emailChange
//     emailChange(e);
//   } // for by rows
// }


function test_emailChange() {
  var dataRange = SpreadsheetApp.getActiveSheet().getDataRange();
  var data = dataRange.getValues();
  var headers = data[0];

/*
  for (var row=42; row < data.length; row++) {
    for (var col=0; col < headers.length; col++) {
            
    }
  }
  */
  
  // Start at row 1, skipping headers in row 0
  for (var row=42; row < data.length; row++) {
    var e = {};
    e.values = data[row].filter(Boolean);  // filter: https://stackoverflow.com/a/19888749
    e.range = dataRange.offset(row,0,1,data[0].length);
    e.namedValues = {};
    // Loop through headers to create namedValues object
    // NOTE: all namedValues are arrays.
    for (var col=0; col < headers.length; col++) {
      e.namedValues[headers[col]] = [data[row][col]];
    }
    // Pass the simulated event to emailChange
    emailChange(e);
  } // for by rows
}

function emailChange(e) {
  
  Logger.log( JSON.stringify( e , null, 2 ) ); // prints line by line

}

