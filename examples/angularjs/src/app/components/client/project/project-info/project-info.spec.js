import ProjectInfoModule from './project-info'
import ProjectInfoController from './project-info.controller';
import ProjectInfoComponent from './project-info.component';
import ProjectInfoTemplate from './project-info.html';

describe('Project-info', () => {
  let $rootScope, makeController;

  beforeEach(window.module(ProjectInfoModule));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new ProjectInfoController();
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
      expect(ProjectInfoTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = ProjectInfoComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(ProjectInfoTemplate);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(ProjectInfoController);
      });
  });
});
