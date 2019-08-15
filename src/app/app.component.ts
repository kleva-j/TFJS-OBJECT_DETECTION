import { Component, OnInit } from '@angular/core';
import * as cocoSSD from '@tensorflow-models/coco-ssd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'TfJs-ObjectDetection';
  width = 1200;
  height = 800;

  loading = 'Loading...';

  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;

  ngOnInit() {
    this.webcam_init();
    this.predictWithCocoModel();
  }

  public async predictWithCocoModel() {
    const model = await cocoSSD.load();
    this.detectFrame(this.video, model);
    this.loading = '';
  }

  webcam_init() {
    this.video = document.getElementById('vid') as HTMLVideoElement;

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: { facingMode: 'user' }
      })
      .then(stream => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = () => {
          this.video.play();
        };
      });
  }

  detectFrame(video: HTMLVideoElement, model: cocoSSD.ObjectDetection) {
    model.detect(video).then((predictions: any) => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  }

  // tslint:disable-next-line: max-line-length
  renderPredictions = (predictions: { forEach: { (arg0: (prediction: any) => void): void; (arg0: (prediction: any) => void): void; }; }) => {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = this.canvas.getContext('2d');
    this.canvas.width  = this.width;
    this.canvas.height = this.height;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const font = '16px sans-serif';
    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.drawImage(this.video, 0, 0, this.width, this.height);

    predictions.forEach((prediction: { bbox: [number, number, number, number]; class: string; }) => {
      // Draw the bounding box.
      const [ x, y, width, height ] = prediction.bbox;
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = '#00FFFF';
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach((prediction: { bbox: [number, number]; class: string; }) => {
      const [ x, y] = prediction.bbox;
      ctx.fillStyle = '#000000';
      ctx.fillText(prediction.class, x, y);
    });
  }
}
