// 3. Réception et 4. Décodage (Google Apps Script)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const folderId = "1e5m06RqAnaamDkHrYOW3ZI1pONyvNVlA";
    const folder = DriveApp.getFolderById(folderId);
    
    // Conversion base64 -> blob
    const byteCharacters = Utilities.base64Decode(data.image);
    const blob = Utilities.newBlob(byteCharacters, 'image/jpeg', data.filename);
    
    // Enregistrement
    const file = folder.createFile(blob);
    
    return ContentService.createTextOutput(
      JSON.stringify({status: 'success', fileId: file.getId()})
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({status: 'error', message: err.message})
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
