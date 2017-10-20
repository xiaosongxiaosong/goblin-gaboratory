import UserModule from './user'
import UserController from './user.controller';
import UserComponent from './user.component';
import UserTemplate from './user.html';

describe('User', () => {
  let $rootScope, makeController;

  beforeEach(window.module(UserModule));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new UserController();
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      let controller = makeController();
      expect(controller).to.have.property('name');
    });
  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has name in template [REMOVE]', () => {
      expect(UserTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = UserComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(UserTemplate);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(UserController);
      });
  });
});
