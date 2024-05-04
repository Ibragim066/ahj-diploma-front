import createRequest from '../../api/createRequest';

/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class PostService {
  constructor(url) {
    this.url = url;
  }

  async list(callback) {
    createRequest({
      url: this.url,
      sendMethod: 'GET',
      method: 'allPosts',
      callback,
    });
  }

  async get(id, callback) {
    createRequest({
      url: this.url,
      sendMethod: 'GET',
      method: 'postById',
      id,
      callback,
    });
  }

  async create(data, callback) {
    createRequest({
      url: this.url,
      sendMethod: 'POST',
      method: 'createPost',
      data,
      callback,
    });
  }

  async filter(data, callback) {
    createRequest({
      url: this.url,
      sendMethod: 'POST',
      method: 'filterPosts',
      data,
      callback,
    });
  }

  async upload(data, callback) {
    createRequest({
      url: this.url,
      sendMethod: 'PUT',
      method: 'upload',
      data,
      callback,
    });
  }
}
