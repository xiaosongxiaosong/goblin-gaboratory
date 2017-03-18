class HomeController {
  constructor() {
    this.name = 'home';

    var list = [];
    for (var i = 0; i < 100; i++) {
      list.push({
        name: 'List Item ' + i,
        idx: i
      });
    }
    this.list = list;
  }
}

export default HomeController;
