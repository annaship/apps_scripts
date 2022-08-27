const SHORT_SHEET_NAME = "Краткая";
const LONG_SHEET_NAME = "Полная";
const FOLDER_NAME = "Rubikus"
const FILENAME = 'MyVarenik';

function getSprData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // console.log(UPLOAD_URL);

  var shortSheet = ss.getSheetByName(SHORT_SHEET_NAME);
  var shortData = shortSheet.getDataRange().getValues();
  return shortData
}

function rmFiles(files) {
  while (files.hasNext()) {
    files.next().setTrashed(true);
  }
  // Drive.Files.emptyTrash();  // If you want to empty the trash box, you can also use this. But when you use this, please be careful.

}

function write2file(filename, blob) {
  var folder = DriveApp.getFoldersByName(FOLDER_NAME).next();
  var files = DriveApp.getFilesByName(filename);
  rmFiles(files);

  var fileSets = {
    title: filename,
    mimeType: 'application/json',
    "parents": [
      {
        "id": folder.getId(),
        "kind": "drive#parentReference"
      }
    ]
  };

  var file = Drive.Files.insert(fileSets, blob);
  Logger.log('ID: %s, File size (bytes): %s, type: %s', file.id, file.fileSize, file.mimeType);

}

function getXML(e) {
    if (!e) throw 'you cannot run/debug this directly\nyou have to either call the url or mock a call';
    if (!e.parameter.id) throw '"id" parameter not informed. Please provide a spreadsheet id.';
    var values = SpreadsheetApp.openById(e.parameter.id).getSheets()[0].getRange('A1:J4').getValues();

    // I modified below script.
    var header = values.shift();
    var data = values.reduce((s, r) => {
      r.forEach((c, j, a) => {
        s += j == 0 ? `<${header[j]}="${c}">` : `<${header[j]}>${c}<\/${header[j].split(" ")[0]}>`;
        if (j == a.length - 1) s += `<\/${header[0].split(" ")[0]}>`;
      });
      return s;
    }, "");

    return XmlService.getPrettyFormat().format(XmlService.parse(`<contents>${data}$</contents>`));
  }

function saveAsJSON() {
  // var ss = SpreadsheetApp.getActiveSpreadsheet();
  // // console.log(UPLOAD_URL);

  // var shortSheet = ss.getSheetByName(SHORT_SHEET_NAME);
  // var shortData = shortSheet.getDataRange().getValues();
  
  // var obj = {//Object literal for testing purposes
  //   key:"value"
  // }
  
/**
 * Creates a file in the users Google Drive
 */

  
  // var folder = DriveApp.getFoldersByName('Rubikus').next();
  // var filename = 'MyVarenik.json';
  // var files = DriveApp.getFilesByName(filename);
  // while (files.hasNext()) {
  //   files.next().setTrashed(true);
  // }
  // Drive.Files.emptyTrash();  // If you want to empty the trash box, you can also use this. But when you use this, please be careful.

  // var fileSets = {
  //   title: filename,
  //   mimeType: 'application/json',
  //   "parents": [
  //     {
  //       "id": folder.getId(),
  //       "kind": "drive#parentReference"
  //     }
  //   ]
  // };
  var shortData = getSprData();
  var short_output = JSON.stringify(shortData);

  var blob = Utilities.newBlob(short_output, "application/vnd.google-apps.script+json");
  var filename = FILENAME + '.json';
  write2file(filename, blob);

  // var file = Drive.Files.insert(fileSets, blob);
  // Logger.log('ID: %s, File size (bytes): %s, type: %s', file.id, file.fileSize, file.mimeType);

}


function doIt(e) {
  if (!e) throw 'you cannot run/debug this directly\nyou have to either call the url or mock a call';
  if (!e.parameter.id) throw '"id" parameter not informed. Please provide a spreadsheet id.';

  var values = SpreadsheetApp.openById(e.parameter.id)
    .getSheets()[0].getRange('A1:B2').getValues();
  return '<sheet>' + values.map(function(row, i) {
    return '<row>' + row.map(function(v) {
      return '<cell>' + v + '</cell>';
    }).join('') + '</row>';
  }).join('') + '</sheet>';
}


function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [
    { name : "опубликовать", functionName : "saveAsJSON"},
  ];
  sheet.addMenu("В Вики", entries);
};

