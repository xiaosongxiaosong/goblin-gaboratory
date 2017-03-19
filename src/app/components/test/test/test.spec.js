import TestModule from './test'
import TestController from './test.controller';
import TestComponent from './test.component';
import TestTemplate from './test.html';

describe('Test', () => {
  let $rootScope, makeController;

  beforeEach(window.module(TestModule));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new TestController();
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
      expect(TestTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = TestComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(TestTemplate);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(TestController);
      });
  });
});
