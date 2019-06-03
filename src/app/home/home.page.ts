import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private camera: Camera, private webview: WebView) {}

  currentImage: any = '';
  image: any = '';
  testImage: '/assets/bellgadse.jpg';

  model: any;
  target;
  tensor;
  predictions;
  arr;

  openCam() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }; // Check semicolon

    this.camera.getPicture(options).then((imageData) => {
      // this.currentImage = 'data:image/jpeg;base64,' + imageData;
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
      this.image = this.webview.convertFileSrc(imageData);
    }, (err) => {
     // Handle error
     console.log('Camera issue:' + err);
    });
  }
  // ------------------------------------------------------
  // Load Model
  async loadModel() {
    this.model = await tf.loadLayersModel('/assets/MobileNet/model.json');
    this.target = document.getElementById('target');
    // this.target = this.image;
    document.getElementById("output1").innerHTML = 'Model loaded';
    document.getElementById("output2").innerHTML = this.target;
  }

  // Prediction
  async onPredict() {
    this.tensor = tf.browser.fromPixels(this.target)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .expandDims();

    this.predictions = await this.model.predict(this.tensor).data();
    this.arr = Array.from(this.predictions);
    // Output
    document.getElementById("output2").innerHTML = "Dog: " + Math.round(this.arr[0]*100) + " %";
    document.getElementById("output3").innerHTML = "Cat: " + Math.round(this.arr[1]*100) + " %";
  }
}
