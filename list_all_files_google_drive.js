//From https://stackoverflow.com/questions/67930017/get-folders-and-files-listed-in-google-sheets-from-a-google-drive-folder-using-a

function listFilesAndFolders() {
  // База Знаний
  // var folderId = '1ScRQhW7Thua8udEgMxRvdhdbesJl_OUZ';
  // Северный поток
  var folderId = '1CIRuZoauWzrIfgiOi5EuyY-U9f7YNVQM';
  var sh = SpreadsheetApp.getActiveSheet();
  sh.clear();
  // sheet.appendRow(["Full Path", "Name", "Date", "URL", "Last Updated", "Description", "Size"]);
  // sheet.appendRow(["Full Path", "Name", "Date", "URL", "Last Updated", "Type", "Size"]);
  // sh.appendRow(["parent", "folder", "name", "update", "size", "URL", "ID", "description", "type"]);
  sheet.appendRow(["Full Path", "Name", "Date", "URL", "Last Updated", "Type", "Size"]);
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
    Logger.log("Folder : " + childFolder.getName());
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
      // sheet.appendRow(["Full Path", "Name", "Date", "URL", "Last Updated", "Type", "Size"]);
      // parentName + "/" + childFolder.getName(),
      // childFolder.getName(),
      // childFolder.getDateCreated(),
      // childFolder.getUrl(),
      // childFolder.getLastUpdated(),
      // childFolder.getDescription(),
      // childFolder.getSize()
      parent + "/" + current_folder.getName(), 
      current_file.getName(), 
      current_file.getDateCreated(), 
      current_file.getUrl(), 
      current_file.getLastUpdated(), 
      current_file.getMimeType(),
      current_file.getSize(), 
      ];
    sh.appendRow(data);
  }
}