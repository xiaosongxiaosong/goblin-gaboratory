import ClientModule from './client'
import ClientController from './client.controller';
import ClientComponent from './client.component';
import ClientTemplate from './client.html';

describe('Client', () => {
  let $rootScope, makeController;

  beforeEach(window.module(ClientModule));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new ClientController();
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
      expect(ClientTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = ClientComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(ClientTemplate);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(ClientController);
      });
  });
});
