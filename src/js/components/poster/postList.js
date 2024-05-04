export default class PostList {
  constructor(postService) {
    this.postService = postService;
  }

  async add(post) {
    const added = new Promise((resolve, reject) => {
      this.postService.create(post, (data) => {
        console.log('inserted');
        resolve(data);
      });
    });

    return await added;
  }

  async filter(filterName, filterValue) {
    const filterData = { filterName, filterValue };
    const filtered = new Promise((resolve, reject) => {
      this.postService.filter(filterData, (data) => {
        console.log('filtered');
        resolve(data);
      });
    });

    return await filtered;
  }
}
