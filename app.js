const video = document.getElementById('camera');
const captureBtn = document.getElementById('capture');
const resultDiv = document.getElementById('result');

// 1. Capture de la caméra
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    resultDiv.textContent = `Erreur caméra: ${err.message}`;
  });

// 2. Préparation à l'envoi (Base64)
captureBtn.addEventListener('click', async () => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  
  // Conversion en base64
  const imageData = canvas.toDataURL('image/jpeg');
  const base64Data = imageData.split(',')[1];
  
  try {
    resultDiv.textContent = "Envoi en cours...";
    await uploadToDrive(base64Data);
    resultDiv.textContent = "Photo envoyée avec succès!";
  } catch (err) {
    resultDiv.textContent = `Erreur envoi: ${err.message}`;
  }
});

// 3. Envoi au serveur
async function uploadToDrive(base64Data) {
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbzbdC-60zvJpOXhWBIgV3kdkIjI1u5M0m-5tajQrpWbrMOHfeNYWuBcflraX_5T4rr4/exec';
  
  const response = await fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: base64Data,
      filename: `photo_${Date.now()}.jpg`
    })
  });
  
  if (!response.ok) {
    throw new Error('Erreur serveur');
  }
}
