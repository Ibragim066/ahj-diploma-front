import Position from './position';

export default class Post {
  constructor(content, type) {
    this.id = Math.floor(performance.now());
    this.content = content;
    this.date = Date.now();
    this.type = type;
  }
}
