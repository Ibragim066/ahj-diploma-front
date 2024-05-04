import Position from './position';
import Timer from './timer';
import Post from './post';
import PostList from './postList';
import PostService from './PostService';
import FileUploader from '../files/fileUploader';
import WarningShow from '../warning/warningShow';
import VideoRec from '../media/videoRec';

export default class PostWidget {
  constructor(containerName) {
    // set urls to the server
    if (process.env.NODE_ENV === 'development') {
      this.urlServer = 'http://localhost:3000';
    } else {
      this.urlServer = 'https://ahj-diploma-backend-7rkr.onrender.com';
    }

    this.containerName = containerName;
    this.postService = new PostService(this.urlServer);
    this.postList = new PostList(this.postService);

    this.onAddSubmit = this.onAddSubmit.bind(this);
    this.onAddLocation = this.onAddLocation.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onClearFilter = this.onClearFilter.bind(this);
  }

  addFormMarkup() {
    return `
        <form class="create-post" name="create-post">
            <input type="text" class="post-text" name="post-text" placeholder="Write something...">
        </form>
        <div class="buttons">
          <form class="upload-form">
            <div class="file-container">
              <input class="overlapped file-input" name="file" type="file" accept="image, video, audio">
              <span class="file-btn">
              <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 32 32" xml:space="preserve">
              <style type="text/css">
                .st0{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
                .st1{fill:none;stroke:#000000;stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;}
              </style>
              <polyline class="st0" points="19,3 19,9 25,9 19,3 7,3 7,29 22,29 "/>
              <circle class="st0" cx="22" cy="22" r="7"/>
              <line class="st0" x1="22" y1="19" x2="22" y2="25"/>
              <line class="st0" x1="19" y1="22" x2="25" y2="22"/>
              <line class="st0" x1="25" y1="9" x2="25" y2="15.7"/>
              </svg>
              </span>
            </div>
          </form>
          <span class="post-video">
          <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 6C3.89543 6 3 6.89543 3 8L3 16C3 17.1046 3.89543 18 5 18H13C14.1046 18 15 17.1046 15 16V8C15 6.89543 14.1046 6 13 6H5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16.4142 10.5858C15.6332 11.3668 15.6332 12.6332 16.4142 13.4142L19.2929 16.2929C19.9229 16.9229 21 16.4767 21 15.5858V8.41421C21 7.52331 19.9229 7.07714 19.2929 7.70711L16.4142 10.5858Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>
        <span class="location-btn">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
        </div>
        `;
  }

  bindToDOM() {
    this.container = document.querySelector(this.containerName);
  }

  bindToDOMAdd() {
    this.form = document.querySelector('.create-post');
    this.inputElem = this.form.querySelector('.post-text');
    this.locationBtn = document.querySelector('.location-btn');
    this.searchInput = document.querySelector('.search-input');
    this.searchForm = document.querySelector('.search-form');
    this.searchBtn = document.querySelector('.search-icon');
    this.filterElem = document.querySelector('.filter-attach');
    this.filterClear = document.querySelector('.filter_all');

    this.form.addEventListener('submit', this.onAddSubmit);
    this.locationBtn.addEventListener('click', this.onAddLocation);
    this.searchForm.addEventListener('submit', this.onSearchSubmit);
    this.searchBtn.addEventListener('click', this.onSearchSubmit);
    this.filterElem.addEventListener('click', this.onFilter);
    this.filterClear.addEventListener('click', this.onClearFilter);
  }

  renderPost(post) {
    const date = new Date(post.date);
    if (post.type === 'video') {
      return `
        <div class="post" data-id="${post.id}">
            <div class="post__date">
              ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date
  .getHours()
  .toString()
  .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
            </div>
            <div class="post__content">
              <video class="${post.content.className}" src="${post.content.src}" controls>
              </video>
            </div>
        </div>
    `;
    }
    if (post.type === 'url') {
      return `
          <div class="post" data-id="${post.id}">
              <div class="post__date">
                ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date
  .getHours()
  .toString()
  .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
              </div>
              <div class="post__content">
                <a href="${post.content}">${post.content}</a>
              </div>
          </div>
      `;
    }
    if (post.type === 'loc') {
      return `
        <div class="post" data-id="${post.id}">
            <div class="post__date">
              ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date
  .getHours()
  .toString()
  .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
            </div>
            <div class="post__content">
              [${post.content.lat}, ${post.content.long}]
            </div>
        </div>
    `;
    }
    if (post.type === 'img') {
      return `
        <div class="post" data-id="${post.id}">
            <div class="post__date">
              ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date
  .getHours()
  .toString()
  .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
            </div>
            <div class="post__content">
              <a download href="${post.content}" rel="noopener" name="abc">
                <img class="post__img" src="${post.content}">
              </a>
            </div>
        </div>
    `;
    }
    if (post.type === 'vid') {
      return `
        <div class="post" data-id="${post.id}">
            <div class="post__date">
              ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date
  .getHours()
  .toString()
  .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
            </div>
            <div class="post__content">
              <video class="video-post" controls src="${post.content}"></video>
            </div>
        </div>
    `;
    }
    if (post.type === 'aud') {
      return `
        <div class="post" data-id="${post.id}">
            <div class="post__date">
              ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date
  .getHours()
  .toString()
  .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
            </div>
            <div class="post__content">
              <audio controls src="${post.content}"></audio>
            </div>
        </div>
    `;
    }

    return `
        <div class="post" data-id="${post.id}">
            <div class="post__date">
              ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date
  .getHours()
  .toString()
  .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
            </div>
            <div class="post__content">
              ${post.content}
            </div>
        </div>
    `;
  }

  renderPosts() {
    const div = document.createElement('div');
    div.className = 'post-container';
    this.container.insertBefore(div, this.form);

    this.postService.list((posts) => {
      posts.forEach((item) => {
        const elemCode = this.renderPost(item);
        div.insertAdjacentHTML('beforeend', elemCode);
      });

      this.postContainer = div;

      // scroll container to the bottom
      setTimeout(() => {
        this.container.scrollTop = this.container.scrollHeight;
      }, 100);
    });
  }

  renderContent() {
    // render list of posts
    this.renderPosts();

    // render add form
    const addForm = document.createElement('form');
    addForm.className = 'create-post';
    addForm.name = 'create-post';
    addForm.innerHTML = this.addFormMarkup();
    this.container.insertBefore(addForm, null);

    // add listeners
    this.bindToDOMAdd();

    // render warning form
    this.warningShow = new WarningShow(this.container);
    this.warningShow.bindToDOM();

    // create new FileUploader
    this.fileUploader = new FileUploader(this.form, this.postService, this.createPostShowAll.bind(this), this.urlServer);
    this.fileUploader.bindToDOM();

    // create new VideoRec
    this.videoRec = new VideoRec(this.form, this.createPostShowAll.bind(this), this.postService, this.urlServer);
    this.videoRec.bindToDOM();
  }

  clearPosts() {
    const posts = Array.from(this.postContainer.querySelectorAll('.post'));
    posts.forEach((item) => {
      item.remove();
    });
  }

  updatePosts(searchedPosts) {
    // if we show only searched posts
    if (searchedPosts) {
      searchedPosts.forEach((item) => {
        const elemCode = this.renderPost(item);
        this.postContainer.insertAdjacentHTML('beforeend', elemCode);
      });
    } else {
      // if we show all posts
      this.postService.list((posts) => {
        posts.forEach((item) => {
          const elemCode = this.renderPost(item);
          this.postContainer.insertAdjacentHTML('beforeend', elemCode);
        });
      });
    }

    // scroll container to the bottom
    setTimeout(() => {
      this.container.scrollTop = this.container.scrollHeight;
    }, 100);
  }

  async createPostShowAll(content, type) {
    const post = new Post(content, type);

    const posts = await this.postList.add(post);

    this.inputElem.value = '';

    // refresh list of posts
    this.clearPosts();
    this.updatePosts(posts);
  }

  onAddSubmit(e) {
    e.preventDefault();

    const text = this.inputElem.value.trim();
    if (this.isValidURL(text)) {
      this.createPostShowAll(text, 'url');
    } else {
      this.createPostShowAll(text, 'text');
    }
  }

  isValidURL(str) {
    if (/^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)$/g.test(str)) {
      return true;
    }
    return false;
  }

  async onAddLocation(e) {
    e.preventDefault();

    let position;
    try {
      position = await Position.getPosition();
    } catch {
      // if we don't have coordinates ask for input
      position = await this.warningShow.showWarning();
    }

    this.createPostShowAll(position, 'loc');
  }

  async onSearchSubmit(e) {
    e.preventDefault();

    let searchedPosts;
    const searchedText = this.searchInput.value.trim();
    if (searchedText) {
      this.postList.filter('content', searchedText).then((posts) => {
        this.clearPosts();
        this.updatePosts(posts);
      });
    } else {
      this.clearPosts();
      this.updatePosts();
    }
  }

  async onFilter(e) {
    let filteredPosts;
    if (e.target.classList.contains('filter_img')) {
      this.postList.filter('type', 'img').then((posts) => {
        this.clearPosts();
        this.updatePosts(posts);
      });
    } else if (e.target.classList.contains('filter_video')) {
      this.postList.filter('type', 'vid').then((posts) => {
        this.clearPosts();
        this.updatePosts(posts);
      });
    } else if (e.target.classList.contains('filter_audio')) {
      this.postList.filter('type', 'aud').then((posts) => {
        this.clearPosts();
        this.updatePosts(posts);
      });
    }
  }

  onClearFilter(e) {
    this.clearPosts();
    this.updatePosts();
  }
}
