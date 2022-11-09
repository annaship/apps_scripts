//From https://stackoverflow.com/questions/67930017/get-folders-and-files-listed-in-google-sheets-from-a-google-drive-folder-using-a

function listFilesAndFolders() {
  // База Знаний
  // var folderId = '1ScRQhW7Thua8udEgMxRvdhdbesJl_OUZ';
  // Северный поток
  var folderId = '1CIRuZoauWzrIfgiOi5EuyY-U9f7YNVQM';
  var current_sheet = SpreadsheetApp.getActiveSheet();
  current_sheet.clear();
  // "File num", "Не проверено", "Name", "Notes", "в Вики", "Full Path", "Date", "URL", "Last Updated", "Size", "Media", "template", "File num", "Ticketed"
  current_sheet.appendRow(["Name", "Full Path", "Date", "URL", "Last Updated", "Size", "Type"]);
  try {
    var parentFolder = DriveApp.getFolderById(folderId);
    listFiles(parentFolder, parentFolder.getName())
    listSubFolders(parentFolder, parentFolder.getName());
  } catch (e) {
    Logger.log(e.toString());
  }
}

function listSubFolders(parentFolder, parent) {
  var childFolders = parentFolder.getFolders();
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    Logger.log("Folder: " + childFolder.getName());
    listFiles(childFolder, parent);
    listSubFolders(childFolder, parent + "|" + childFolder.getName());
  }
}

function listFiles(current_folder, parent){
  var sh = SpreadsheetApp.getActiveSheet();
  var data = [];
  var files = current_folder.getFiles();
  while (files.hasNext()) {
    var current_file = files.next();
    data = [ 
    // sheet.appendRow(["Name", "Full Path", "Date", "URL", "Last Updated", "Size", "Type"]);
      current_file.getName(), 
      parent + "/" + current_folder.getName(), 
      current_file.getDateCreated(), 
      current_file.getUrl(), 
      current_file.getLastUpdated(), 
      current_file.getSize(), 
      current_file.getMimeType(),
      ];
    sh.appendRow(data);
  }
}