/**
 * https://support.google.com/docs/thread/53971944?msgid=54186913
 * Modified by A. Shipunova Aug 22 2022
 * Needs an onEdit trigger to be able to write in another spreadsheet
 * For report use this formula:
 
=query('Change log'!A1:E, "select toDate(A), count(A) where A is not null group by toDate(A) label toDate(A) 'Date', count(A) 'Number of edits' ", 1)
 
* Automatically logs changes to a range.
*
* To take this script into use:
* 
*  - take a backup of your spreadsheet through File > Make a copy
*  - select all the text in this script, starting at the first "/**"
*    line above, and ending at the last "}"
*  - copy the script to the clipboard with Control+C (on a Mac, ⌘C)
*  - open the spreadsheet where you want to use the function
*  - choose Tools > Script editor > Blank (this opens a new tab)
*  - if you see just the 'function myFunction() {}' placeholder, press
*    Control+A (on a Mac, ⌘A), followed by Control+V (⌘V) to paste
*    the script in
*  - otherwise, choose File > New > Script file, then press
*    Control+A (⌘A) followed by Control+V (⌘V) to paste the script in
*  - if you have an existing onEdit(e) function, add the following line
*    as the first line after the initial '{' in that onEdit(e) function:
*      logChanges_(e);
*    ...and then delete the onEdit(e) function below
*  - modify the settings under "START modifiable parameters" as necessary
*  - press Control+S (⌘S) to save the script
*  - when prompted, name the project 'Log changes'
*  - close the script editor tab and go back to the spreadsheet tab
*  - the script will run automatically when you edit a cell
*
* @see https://support.google.com/docs/thread/53971944?msgid=54171232
*/
/**
* Simple trigger that runs each time the user edits the spreadsheet.
*
* @param {Object} e The onEdit() event object.
*/
function myOnEdit(e) {
  if (!e) {
    throw new Error('Please do not run the script in the script editor window. It runs automatically when you edit the spreadsheet.');
  }
  logChanges_(e);
}

/**
* Logs changes to a range.
*
* @param {Object} e The onEdit() event object.
*/
function logChanges_(e) {
  // version 1.0, written by --Hyde, 18 June 2020
  //  - initial version
  //  - see https://support.google.com/docs/thread/53971944?msgid=54171232
  var ss = e.source;
  try {
    ////////////////////////////////
    // [START modifiable parameters]
    const rangesToWatch = [ss.getRange('Полная!A1:P')];
    // [END modifiable parameters]
    ////////////////////////////////
    let intersect = null;
    for (let r = 0, numRanges = rangesToWatch.length; r < numRanges; r++) {
      intersect = getRangeIntersection_(rangesToWatch[r], e.range);
      if (intersect) {
        break;
      }
    };
    if (!intersect) {
      return;
    }
    let logSheet = get_log_sheet();
    const timestamp = new Date();
    const rowLabels = intersect.sheet.getRange(1, intersect.sheet.getFrozenColumns() || 1, intersect.sheet.getLastRow(), 1).getDisplayValues().flat();
    const columnLabels = intersect.sheet.getRange(intersect.sheet.getFrozenRows() || 1, 1, 1, intersect.sheet.getLastColumn()).getDisplayValues().flat();
    const displayValues = intersect.range.getDisplayValues();
    for (let row = 0, numRows = displayValues.length; row < numRows; row++) {
      for (let column = 0, numColumns = displayValues[row].length; column < numColumns; column++) {
        const rowIndex = e.range.rowStart + row - 1;
        const rowLabel = rowLabels[rowIndex] || 'row ' + rowIndex;
        const columnIndex = e.range.columnStart + column - 1;
        const columnLabel = columnLabels[columnIndex] || 'column ' + columnIndex;
        const newValue = displayValues[row][column];
        const oldValue = e.oldValue === undefined ? '(unavailable)' : String(e.oldValue);
        logSheet.appendRow([timestamp, rowLabel, columnLabel, oldValue, newValue]);
      }
    }
  } catch (error) {
    showAndThrow_(error);
  }
}

/**
* Returns the intersection of two ranges as an object that contains a new range and its grid coordinates.
*
* @param {Range} range A spreadsheet range object.
* @param {Range} intersectingRange A spreadsheet range object that possibly overlaps range.
* @return {Object} The intersection of range and intersectingRange, or null if they do not overlap. The return object has these fields:
*                  range       A range that represents the intersection of range1 and intersectingRange.
*                  firstRow    The first row of the intersection.
*                  firstColumn The first column of the intersection.
*                  lastRow     The last row of the intersection.
*                  lastColumn  The last column of the intersection.
*                  numRows     The number of rows in the intersection.
*                  numColumns  The number of columns in the intersection.
*/
function getRangeIntersection_(range, intersectingRange) {
  // version 1.1, written by --Hyde, 18 June 2020
  //  - add sheet in return object
  // version 1.0, written by --Hyde, 22 January 2019
  //  - initial version
  if (range.getSheet().getSheetId() !== intersectingRange.getSheet().getSheetId()) {
    return null;
  }
  var firstRow = Math.max(range.getRow(), intersectingRange.getRow());
  var lastRow = Math.min(range.getLastRow(), intersectingRange.getLastRow());
  if (firstRow > lastRow) {
    return null;
  }
  var firstColumn = Math.max(range.getColumn(), intersectingRange.getColumn());
  var lastColumn = Math.min(range.getLastColumn(), intersectingRange.getLastColumn());
  if (firstColumn > lastColumn) {
    return null;
  }
  return {
    sheet: range.getSheet(),
    range: range.getSheet().getRange(firstRow, firstColumn, lastRow - firstRow + 1, lastColumn - firstColumn + 1),
    firstRow: firstRow,
    firstColumn: firstColumn,
    lastRow: lastRow,
    lastColumn: lastColumn,
    numRows: lastRow - firstRow + 1,
    numColumns: lastColumn - firstColumn + 1,
  };
}

/**
* Shows error.message in a pop-up and throws the error.
*
* @param {Error} error The error to show and throw.
*/
function showAndThrow_(error) {
  // version 1.0, written by --Hyde, 16 April 2020
  //  - initial version
  var stackCodeLines = String(error.stack).match(/\d+:/);
  if (stackCodeLines) {
    var codeLine = stackCodeLines.join(', ').slice(0, -1);
  } else {
    codeLine = error.stack;
  }
  showMessage_(error.message + ' Code line: ' + codeLine, 30);
  throw error;
}

/**
* Shows a message in a pop-up.
*
* @param {String} message The message to show.
* @param {Number} timeoutSeconds Optional. The number of seconds before the message goes away. Defaults to 5.
*/
function showMessage_(message, timeoutSeconds) {
  // version 1.0, written by --Hyde, 16 April 2020
  //  - initial version
  SpreadsheetApp.getActive().toast(message, 'Log changes', timeoutSeconds || 5);
}

/**
 * Creates or finds a log sheet;
 * works, creates a sheet if none
 */
function get_log_sheet() {
    ////////////////////////////////
    // [START modifiable parameters]
    const logFileName = "change_log_file";
    const logSheetName = 'Change log';
    // [END modifiable parameters]
    ////////////////////////////////
    var logFile = DriveApp.getFilesByName(logFileName);
    var dstid = logFile.hasNext()
    ? logFile.next().getId()
    : SpreadsheetApp.create(logFileName).getId();
  
  var new_sheet = SpreadsheetApp.openById(dstid);
  let logSheet = new_sheet.getSheetByName(logSheetName);
  if (!logSheet) {
    logSheet = new_sheet.insertSheet(logSheetName);
    logSheet.appendRow(['Timestamp', 'Row label', 'Column label', 'Old value', 'New value']);
    logSheet.setFrozenRows(1);
  }
  return logSheet;
}

