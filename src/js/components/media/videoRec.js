import Timer from '../poster/timer';

export default class VideoRec {
  constructor(form, createPostShowAll, postService, url) {
    this.form = form;
    this.createPostShowAll = createPostShowAll;
    this.postService = postService;
    this.url = url;

    this.onAddVideoSubmit = this.onAddVideoSubmit.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.onStopVideoAndHide = this.onStopVideoAndHide.bind(this);
    this.onCanPlay = this.onCanPlay.bind(this);
  }

  bindToDOM() {
    this.videoBtn = this.form.querySelector('.post-video');
    this.videoPlayer = document.querySelector('.video');
    this.videoControls = document.querySelector('.video-controls');
    this.videoTimer = document.querySelector('.video-timer');
    this.videoSaveBtn = document.querySelector('.video-save');
    this.videoCancelBtn = document.querySelector('.video-cancel');

    this.videoBtn.addEventListener('click', this.onAddVideoSubmit);
    this.videoSaveBtn.addEventListener('click', this.onStopVideoAndHide);
    this.videoCancelBtn.addEventListener('click', this.onStopVideoAndHide);
  }

  updateTimer() {
    if (this.timer.sec === 59) {
      this.timer.min++;
      this.timer.sec = 0;
    } else {
      this.timer.sec++;
    }
    this.videoTimer.textContent = `${this.timer.min.toString().padStart(2, '0')}:${this.timer.sec.toString().padStart(2, '0')}`;
  }

  toggleVideoBlock() {
    this.videoPlayer.classList.toggle('video_active');
    this.videoControls.classList.toggle('video-controls_active');
  }

  onStopVideoAndHide(e) {
    if (e.target.className === 'video-cancel') {
      this.cancelled = true;
    }
    this.recorder.stop();
    this.stream.getTracks().forEach((track) => track.stop());
    this.toggleVideoBlock();
    this.videoBtn.classList.toggle('hidden');
  }

  onCanPlay() {
    this.timer = new Timer(0, 0);
    this.videoIntervalId = setInterval(this.updateTimer, 1000);
    this.videoPlayer.play();
  }

  async onAddVideoSubmit(e) {
    this.videoBtn.classList.toggle('hidden');

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.stream = stream;

    this.videoPlayer.srcObject = stream;
    this.videoPlayer.muted = true;
    this.toggleVideoBlock();

    this.videoPlayer.addEventListener('canplay', this.onCanPlay);

    const recorder = new MediaRecorder(stream);
    this.recorder = recorder;
    const chunks = [];

    recorder.addEventListener('start', () => {
      console.log('start');
      this.cancelled = false;
    });

    recorder.addEventListener('dataavailable', (event) => {
      chunks.push(event.data);
    });

    recorder.addEventListener('stop', async () => {
      if (this.videoIntervalId) {
        clearInterval(this.videoIntervalId);
        this.videoPlayer.removeEventListener('canplay', this.onCanPlay);
      }
      // create new post with video player in it
      if (!this.cancelled) {
        const blob = new Blob(chunks);

        const urlLoc = URL.createObjectURL(blob);

        let url;

        this.uploadVideoForm = document.querySelector('.video-form');
        this.videoFileInput = document.querySelector('.video-file-input');

        const fileBlob = new File([blob], 'tmpFile', {
          type: blob.type,
        });

        // create a DataTransfer to get a FileList
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(fileBlob);
        this.videoFileInput.files = dataTransfer.files;

        const data = new FormData(this.uploadVideoForm);

        this.postService.upload(data, (d) => {
          console.log('uploaded');
          url = `${this.url}${d}`; // `http://localhost:3000${d}`;

          this.createPostShowAll(url, 'vid');
        });
      }
    });

    recorder.start();
  }
}
