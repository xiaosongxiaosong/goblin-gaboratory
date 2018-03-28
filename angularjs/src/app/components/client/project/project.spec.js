import ProjectModule from './project'
import ProjectController from './project.controller';
import ProjectComponent from './project.component';
import ProjectTemplate from './project.html';

describe('Project', () => {
  let $rootScope, makeController;

  beforeEach(window.module(ProjectModule));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new ProjectController();
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
      expect(ProjectTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = ProjectComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(ProjectTemplate);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(ProjectController);
      });
  });
});
