const SHORT_SHEET_NAME = "Краткая";
const LONG_SHEET_NAME = "Полная";
const UPLOAD_URL = "https://docs.google.com/document/d/1lLeYBsZTAaNe6jXvcPpHRemmwVadKpbPf_mEVnGgKns/edit";

function publishData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  console.log(UPLOAD_URL);

  var shortSheet = ss.getSheetByName(SHORT_SHEET_NAME);
  var shortData = shortSheet.getDataRange().getValues();
  var longSheet = ss.getSheetByName(LONG_SHEET_NAME);
  var longData = longSheet.getDataRange().getValues();

  var data = {
    version: 1,
    updateDate: new Date(),
    columnsToShow: [
      "documents",
      "statuses",
      "payments",
      "housing",
      "medicine",
      "transport",
      "work",
      "education",
      "driver",
      "pets",
      "covid"
    ],
    dataShort: shortData,
    dataLong: longData
  }

  var payload = JSON.stringify(shortData);
  var response = UrlFetchApp.fetch(UPLOAD_URL, {
    'method' : 'PUT',
    'contentType' : "application/json",
    'payload' : payload
  });
}

function saveAsJSON() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // console.log(UPLOAD_URL);

  var shortSheet = ss.getSheetByName(SHORT_SHEET_NAME);
  var shortData = shortSheet.getDataRange().getValues();
  
  // var obj = {//Object literal for testing purposes
    // key:"value"
  // }

/**
 * Creates a file in the users Google Drive
 */
  
  var folder = DriveApp.getFoldersByName('Rubikus').next();
  var filename = 'MyVarenik.json';
  // var files = DriveApp.getFilesByName(filename);

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
  var short_output = JSON.stringify(shortData);

  var blob = Utilities.newBlob(short_output, "application/vnd.google-apps.script+json");
  var file = Drive.Files.insert(fileSets, blob);
  Logger.log('ID: %s, File size (bytes): %s, type: %s', file.id, file.fileSize, file.mimeType);

}

function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var shortSheet = ss.getSheetByName(SHORT_SHEET_NAME);
  var shortData = shortSheet.getDataRange().getValues();
  var jOutput = JSON.stringify(shortData);

  // var e = {//Object literal for testing purposes
  //   key:"value"
  // }

  // var content;
  // try {
  //   content = doIt(e);
  // } catch(err) {
  //   content = '<error>' + (err.message || err) + '</error>';
  // }
  // return ContentService.createTextOutput(content)
  //   .setMimeType(ContentService.MimeType.XML);

  var a = ContentService.createTextOutput(jOutput).setMimeType(ContentService.MimeType.XML);
  console.log(a);

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
    { name : "опубликовать", functionName : "publishData"},
  ];
  sheet.addMenu("Вареник", entries);
};
