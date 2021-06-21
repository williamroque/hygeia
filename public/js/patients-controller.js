const patientsContainer = document.querySelector('#patients-list');


class PatientsController {
    constructor(patientsList, selectPatientCallback) {
        this.patientsList = patientsList;
        this.selectPatientCallback = selectPatientCallback;
    }

    render() {
        this.patientsList.forEach(patient => {
            const patientContainer = document.createElement('div');
            patientContainer.setAttribute('id', patient._id);
            patientContainer.classList.add('patient-entry');

            const nameContainer = document.createElement('div');
            nameContainer.classList.add('patient-entry-name');
            nameContainer.innerText = patient.module_data.registration.name;
            patientContainer.appendChild(nameContainer);

            const subtitleContainer = document.createElement('table');
            subtitleContainer.classList.add('patient-entry-subtitle');

            const phoneRow = document.createElement('tr');

            const phoneTopic = document.createElement('td');
            phoneTopic.innerText = 'Telefone';
            phoneRow.appendChild(phoneTopic);

            const phone = patient.module_data.registration.phone;
            const phoneEntry = document.createElement('td');
            phoneEntry.innerText = `― ${phone}`;
            phoneRow.appendChild(phoneEntry);

            subtitleContainer.appendChild(phoneRow);

            const ageRow = document.createElement('tr');

            const ageTopic = document.createElement('td');
            ageTopic.innerText = 'Idade';
            ageRow.appendChild(ageTopic);

            const age = patient.module_data.registration.age;
            const ageEntry = document.createElement('td');
            ageEntry.innerText = `― ${age}`;
            ageRow.appendChild(ageEntry);

            subtitleContainer.appendChild(ageRow);

            patientContainer.appendChild(subtitleContainer);

            patientContainer.addEventListener('click', e => {
                const patientID = e.currentTarget.getAttribute('id');

                this.selectPatientCallback(patientID);
            }, false);

            patientsContainer.appendChild(patientContainer);
        });
    }
}
