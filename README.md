# Ὑγεία
A free hospital management system.

## Table of contents

* [1. Expected features](#1)
    * [1.1. Notes](#1.1)
* [2. Project overview](#2)
    * [2.1. Notes](#2.1)
* [3. Additional questions](#3)
* [4. Dependencies](#4)
* [5. Standards](#5)
* [6. Project structure](#6)
* [7. Design](#7)
    * [7.1. Mobile views](#7.1)
    * [7.2. Desktop view](#7.2)
* [8. Meeting notes](#8)
    * [8.1. Roger](#8.1)
* [9. Roadmap](#9)
* [10. Database](#10)


<h2 id="1">1. Expected features</h2>

* Patient registration → name, address, contact information, birth date, employer, insurance; patient ID; benefits eligibility; SMS/email updates
* Appointments and scheduling → docs, lab, radiology; both patients and staff check status; send updates
* Patient billing, insurance claims; invoice, payment due; analytics
* Patient admission, room, diet (manage, discharge, transfer); bed, ward, room based on availability and cost; ensure correct discharge process; record and generate documents (e.g., consent forms); discharge summary, including lab results (customizable), complaint and diagnosis, therapy administered and response, recommendations on discharge
* Lab management → record test results; generate reports and billing; send patient SMS/email when results are available<sup>[1](#1.1)</sup>
* Radiology → reporting tool for CT, MRI, ultrasound, x-ray, PACS; smart interpretation tools<sup>[2](#1.1)</sup>
* Pharmacy → link to patient billing; oversee drug distribution; management of stock; generate prescriptions<sup>[3](#1.1)</sup>
* Inventory management → delivery due dates; maintain stock; show warnings<sup>[4](#1.1)</sup>
* Role-based security
* Pre-admission activities
* Reception management → patient/doctor status
* Patient portal
* Analytics → medical, management, payroll, accounts
* Barcode scanning → patients and stock
* Lab equipment interfacing
* Patient service management
* Blood bank management → blood collection, transfusion; donor/recipient reactions
* Ambulance management → appointments and scheduling, rosters, tariff management
* Canteen management
* Staff attendance management
* Nurse management → nurse assessments; patient admission; vital signs; scheduled task management
* Operating theater management → scheduling; team management; surgery details; electronic consent; CPT codes; pre-operative assessment, anesthesia details and monitoring; inventory management
* Equipment maintenance management
* Asset management → hospital fixed assets
* Urgent care notification system
* Encrypted communication

<h3 id="1.1">1.1. Notes</h3>

1. Ask about received format of lab results [Solved](#8.1)
2. Ask about interpretation tools [Solved](#8.1)
3. Ask about legislation surrounding drug prescriptions. Would digital signatures/simple DB update be legally sufficient? [Solved](#8.1)
4. Ask about automated request routines [Solved](#8.1)

<h2 id="2">2. Project overview</h2>

* Main view: patients, search
* Role-based access privileges for patient archives<sup>[1](#2.1)</sup>
* Patient view made of modules (registration, pathology with history, prescription with history, imaging, etc.) → modules available and configured according to role and delegation status (e.g., pharmacist may only see but not edit registration and may only deliver drugs based on prescription<sup>[2](#2.1)</sup>)
* Create global modules (e.g., pharmacy, where the stock may be edited)
* Prescriptions informed by stock
* Stock may have such features as scanning
* Only administrator has staff module → add, edit, delete staff/roles
* Modules are `Rust` + `data` directory (serving module page and perhaps imaging, for example)
* Bulk of patient/staff data stored in localized `MongoDB` database (no external access)
* Web server in `Rust` (`actix-web`)
* Look into inter-module communication (`DICOM` may be useful in achieving this)
* Consider hidden/dependency modules for integration with visible modules (e.g., accounting module communicates with Excel module to create reports)
* Prescription may be printed
* Prescription may have expiration date (to the effect of minimizing theft, perhaps)
* Consider patient interface to schedule/confirm/check surgeries, appointments, track developments<sup>[3](#2.1) [4](#2.1)</sup>
    * SMS/email notification may alternatively/additionally notify patients and professionals of upcoming surgeries, appointments, and drug pickups
* Mitigate DoS/brute force attacks by blocking IPs with a certain number of failed login attempts (managed as a global module by administrator)
* Use library crate for core functionality (e.g., DB, message serialization/deserialization, etc.) and multiple binary crates (modules, server)
* Server modularity may be achieved by syncing databases via Ethernet and resolving local domain to redirecting agent → if on separate networks, simply sync and forward directly
* Only one active session at a time for a given user
* Session ID and IP stored as cookie, expiration date of one week
* Credentials sent as hash of `username;password_hash;date` (calculated on-client)
* Server hosted via router with no Internet access
* Add package-install script to update modules manifest (DB) and unpack module
* Module should expose possible search parameters and implement search
    * E.g., registration module might expose name or age, while pharmacy should
      search using prescription size or drug name
* Patient greeting workflow → search for patient by name or other parameter; at
  the end of search results (whether or not there are any), there should be a 'create new'
  option if staff member has permission (module results should specify this,
  button hook should verify this on-server); if opted to create patient, create
  patient with ID (check conflicts after setting to hash of `staff_username;date`)
* Patient should have valid, government-issued documentation; lab results and
  drug pickup should be limited to patient (with valid documentation) or
  registered associate (with valid documentation; subject to analytics)

<h3 id="2.1">2.1. Notes</h3>

1. Ask about workflow/delegation practices in context of security
2. Consider secure methods of confirmation (reduce theft)
3. Ask whether follow-up metrics can be sufficiently objective to create automated patient reporting [Solved](#8.1)
4. Consider patient archive mutating privileges (design to prevent pharmacy/insurance fraud while reserving their right to limit/edit personal information)

<h2 id="3">3. Additional questions</h2>

* Ask about diagnostics enhancing tools
* How are results from radiology currently processed? [Solved](#8.1)
* What kinds of equipment should the inventory record?
* How is new equipment requested? [Solved](#8.1)
* How are patients from other doctors managed?

<h2 id="4">4. Dependencies</h2>

* `rustls`
* `actix-web`
* [`Let's Encrypt`](https://letsencrypt.org)
* `serde`
* [`Twilio`](https://twilio.com)

<h2 id="5">5. Standards</h2>

* [`LOINC`](https://www.loinc.org) → lab/clinical test results
* [`ICD-10`](https://www.who.int/classifications/icd/en/) → international classification of diseases and related health problems
* [`DICOM`](https://www.dicomstandard.org) → international standard to transmit, store, retrieve, print, process, and display medical imaging information

<h2 id="6">6. Project structure</h2>

* `hygeia`
    * `mongo-date`
    * `setup.sh`
    * `runtime`
        * `public`
            * `html/*`
            * `css/*`
            * `js/*`
        * `./hygeia`
        * `modules`
            * `roles`
                * `*`
                    * `*`
                        * `./module_name`
                        * `data/*` (`js` files probably merged later on)
    * `hygeia`
        * `Cargo.toml`
        * `src`
            * `hygeia`
                * `core`
                    * `lib.rs`
                    * `module`
                        * `mod.rs`
                        * `manager.rs`
                    * `data`
                        * `mod.rs`
                        * `db.rs`
                    * `message`
                        * `mod.rs`
                        * `message.rs`
                * `server`
                    * `main.rs`
            * `modules`
                * `roles`
                    * `*`
                        * `*`
                            * `main.rs`
                            * `...`

<h2 id="7">7. Design</h2>
<h3 id="7.1">7.1. Mobile views</h3>

![Mobile views](.docs/mobile_design.png)

<h3 id="7.2">7.2. Desktop view</h3>

![Desktop view](.docs/desktop_design.png)

<h2 id="8">8. Meeting notes</h2>
<h3 id="8.1">8.1. Roger</h3>

* Look into referencing to other hospitals, particularly in an on-demand setting
* Portaria 2048 may provide description of basic required functionality → also makes specifications based on structure
* Emphasize activity management of staff and integrate with equipment, for instance
* Maintain persistent archive of activity
* *Tie activity into payroll*
* Communicate with state health administration
* Look into MV system
* Look into available state health system
* Principal functionality surrounds clinic, pediatric, track patient status
* Physiotherapy, dietician, technical nurse implied near room allocation
* Operating theater is used for childbirth → moved to room
* Make class distinctions between operating theaters
* Minor surgeries may be performed outside theaters
* Consider dynamic allocation of theater based on equipment and procedures involved
* Consider overflowing processes
* Look into and suggest integration with Butterfly equipment
* Resonance appears to have proprietary visualization software
* Ultrasound, tomography, radiography are basic required imaging equipment
* Look into haemodynamics equipment
* System exists for lab results
* Digital signature is required for prescription to be legally sufficient
* Attempt to enhance prescriptions based on patient condition and drug database and manage conflicts
* Have levels of confirmation between prescribing agent and pharmacist/nurse
    * Customize levels of confirmation based on strength
    * Add strong verification system to prescribe accurate drugs
    * Strong recording system for administered drugs
* Have levels of confirmation for equipment use → request system
* Material left in facility for consumption as needed → look further into available methods
    * Attach acquisition notes
* Create strong notification system for stock
* Consult notes on material acquisition
* Automated patient follow-up would be welcome
* Consider secure methods of validation for visitation

<h2 id="9">Roadmap</h2>

- [ ] Data
   - [ ] Configure database to only accept localhost (though it should be this way
         by default)
   - [x] Plan database
      - [x] Factor in staff → roles, preferences, notifications, username, password
         (hash), contact information, module-specific data
      - [x] Factor in patients → module-specific data
   - [ ] Implement interface with MongoDB
      - [ ] Implement lock to block write access while other user is writing
   - [ ] Create setup script to automatically install necessary tools
   - [ ] Implement message interface
   - [ ] Implement message type for database access


<h2 id="10">Database</h2>

Model for hygeia database:
```json
{
    "staff": [
        {
            "username": [String],
            "password": [String; hash],
            "roles": [[Role; Administrator | Physician | Surgeon | Nurse |
            Pharmacist | Kitchen]],
            "clearance": [Integer; relevant on a per-module basis],
            "email": [String],
            "phone": [String],
            "address": [String],
            "preferences": {
                [Key; section ID]: {
                    [Key; setting ID]: [Generic; setting]
                }
            },
            "notifications": [
                {
                    "module": [String; module ID],
                    "timestamp": [DateString; "%H-%M-%S:%d-%m-%Y"],
                    "urgency": [Urgency; Min | Mid | Max],
                    "message": [String]
                }
            ],
            "modules": {
                [Key; module ID]: {
                    "permissions": [
                        {
                            "type": [String; module-specific permission ID],
                            "patients": [[String; patient IDs]]
                        }
                    ]
                }
            }
        }
    ],
    "patients": [
        {
            "module_data": {
                [Key; module ID]: {
                    [String; field name]: [Generic; module-specific data]
                }
            }
        }
    ],
    "modules": [
        {
            "id": [String; module ID],
            "roles": [[Role; permitted roles]],
            "title": [String; display name],
            "searchParameters": [
                {
                    "id": [String],
                    "title": [String]
                }
            ]
        }
    ]
}
```
