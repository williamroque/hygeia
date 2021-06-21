const client = new Client();

let patients = client.request('GET', 'patients');
patients.then(res => {
    res = JSON.parse(res);

    const patientsController = new PatientsController(res, () => {});
    patientsController.render();
});

const modules = client.request('GET', 'modules');
modules.then(res => {
    res = JSON.parse(res);

    const modulesController = new ModulesController(res, () => {});
    modulesController.render();
});
