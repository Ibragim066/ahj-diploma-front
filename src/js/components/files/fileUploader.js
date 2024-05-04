export default class FileUploader {
  constructor(form, postService, createPostShowAll, url) {
    this.postService = postService;
    this.createPostShowAll = createPostShowAll;
    this.form = form;
    this.url = url;

    this.onAddFile = this.onAddFile.bind(this);
    this.onDropFile = this.onDropFile.bind(this);
  }

  bindToDOM() {
    this.fileInput = document.querySelector('.file-input');
    this.fileContainer = document.querySelector('.file-container');
    this.uploadForm = document.querySelector('.upload-form');

    this.fileContainer.addEventListener('click', (e) => {
      this.fileInput.dispatchEvent(new MouseEvent('click'));
    });
    this.fileInput.addEventListener('change', this.onAddFile);
    this.form.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    this.form.addEventListener('drop', this.onDropFile);
  }

  onAddFile(e) {
    console.dir(this.fileInput);

    const file = this.fileInput.files && this.fileInput.files[0];

    let url;

    const data = new FormData(this.uploadForm);

    this.postService.upload(data, (d) => {
      console.log('uploaded');
      url = `${this.url}${d}`; // `http://localhost:3000${d}`;

      if (file.type.includes('image')) {
        this.createPostShowAll(url, 'img');
      } else if (file.type.includes('video')) {
        this.createPostShowAll(url, 'vid');
      } else if (file.type.includes('audio')) {
        this.createPostShowAll(url, 'aud');
      }
    });
  }

  onDropFile(e) {
    e.preventDefault();

    const file = e.dataTransfer.files && e.dataTransfer.files[0];

    let url;

    this.fileInput.files = e.dataTransfer.files;

    const data = new FormData(this.uploadForm);

    this.postService.upload(data, (d) => {
      console.log('uploaded');
      url = `${this.url}${d}`; // `http://localhost:3000${d}`;

      if (file.type.includes('image')) {
        this.createPostShowAll(url, 'img');
      } else if (file.type.includes('video')) {
        this.createPostShowAll(url, 'vid');
      } else if (file.type.includes('audio')) {
        this.createPostShowAll(url, 'aud');
      }
    });
  }
}
