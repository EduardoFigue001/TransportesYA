import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

async function takePicture() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera
  });

  console.log('Imagen tomada:', image);
  // Puedes usar la URL de la imagen para mostrarla en tu aplicación.
  const imageUrl = image.webPath;
}
