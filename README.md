# GMVC API

## APIs

- [ ] DB Connection
  - https://www.jeremydaly.com/reuse-database-connections-aws-lambda/
- [ ] Error Handling
- [ ] Response Structure
  - Status Codes
  - Error Messages
  - Responses for POST/PUT/DELETE
- [ ] Typesafe Responses
- [ ] Medications unique on Name + Strength
- [ ] Patient Conditions unique on patient id + condition id
- [ ] Go through lambdas and add checking for each (e.g. note length, name length, etc.)

### Patient

- [x] GET Patient
- [ ] GET PatientConditions
- [ ] GET PatientMedications
- [ ] GET PatientMetrics
- [x] GET PatientNotes
- [x] GET Patients
- [x] POST Patient
- [ ] POST PatientCondition
- [ ] POST PatientMedication
- [ ] POST PatientMetric
- [x] POST PatientNote
- [x] PUT Patient
- [ ] PUT PatientCondition
- [ ] PUT PatientMedication
- [ ] PUT PatientMetric
- [x] PUT PatientNote
- [x] DELETE Patient
- [ ] DELETE PatientCondition
- [ ] DELETE PatientMedication
- [ ] DELETE PatientMetric
- [x] DELETE PatientNote

### Conditions

- [x] GET Conditions

### Medications

- [x] GET Medications
- [x] POST Medication
- [x] PUT Medication
- [x] DELETE Medication

### Metrics

- [x] GET Metrics
