import { $mdSidenav } from 'angular-material';

class AppController {
  constructor() {
    var list = [];
    for (var i = 0; i < 100; i++) {
      list.push({
        name: 'List Item ' + i,
        idx: i
      });
    }
    this.list = list;
  }
  
  toggleSidenav(menuId) {
    $mdSidenav(menuId).toggle();
  }
}

export default AppController;
