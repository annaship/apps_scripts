//From https://stackoverflow.com/questions/67930017/get-folders-and-files-listed-in-google-sheets-from-a-google-drive-folder-using-a

function listFilesAndFolders() {
  var folderid = '18akqHAN7PSPMnG3h5HpCskQsMCv4TqCM'; // change FolderID
  var sh = SpreadsheetApp.getActiveSheet();
  sh.clear();
  sh.appendRow(["parent", "folder", "name", "update", "size", "URL", "ID", "description", "type"]);
  try {
    var parentFolder = DriveApp.getFolderById(folderid);
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
    Logger.log("Fold : " + childFolder.getName());
    listFiles(childFolder, parent)
    listSubFolders(childFolder, parent + "|" + childFolder.getName());
  }
}

function listFiles(fold, parent){
  var sh = SpreadsheetApp.getActiveSheet();
  var data = [];
  var files = fold.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    data = [ 
      parent, 
      fold.getName(), 
      file.getName(), 
      file.getLastUpdated(), 
      file.getSize(), 
      file.getUrl(), 
      file.getId(), 
      file.getDescription(), 
      file.getMimeType()
      ];
    sh.appendRow(data);
  }
}