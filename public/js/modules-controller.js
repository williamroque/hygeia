const modulesContainer = document.querySelector('#modules-list');


class ModulesController {
    constructor(modulesList, selectModuleCallback) {
        this.modulesList = modulesList;
        this.selectModuleCallback = selectModuleCallback;
    }

    render() {
        this.modulesList.forEach(module => {
            const moduleContainer = document.createElement('div');
            moduleContainer.setAttribute('id', module.id);
            moduleContainer.classList.add('module-entry');

            moduleContainer.innerText = module.title;

            moduleContainer.addEventListener('click', e => {
                const moduleID = e.currentTarget.getAttribute('id');

                this.selectModuleCallback(moduleID);
            }, false);

            modulesContainer.appendChild(moduleContainer);
        });
    }
}
