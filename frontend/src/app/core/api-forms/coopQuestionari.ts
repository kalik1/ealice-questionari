import { FormGroup, FormControl, Validators } from '@angular/forms';

export const loginDtoForm = new FormGroup({
  email: new FormControl(null, [Validators.required]),
  password: new FormControl(null, [Validators.required]),
  rememberMe: new FormControl(null, [])
});

export const idNameDtoForm = new FormGroup({
  id: new FormControl(null, [Validators.required]),
  name: new FormControl(null, [Validators.required])
});

export const readUserDtoForm = new FormGroup({
  id: new FormControl(null, [Validators.required]),
  email: new FormControl(null, [Validators.required]),
  name: new FormControl(null, [Validators.required]),
  yearOfBirth: new FormControl(null, [Validators.required]),
  gender: new FormControl(null, [Validators.required]),
  role: new FormControl(null, [Validators.required]),
  coop: new FormControl(null, [])
});

export const signInResponseDtoForm = new FormGroup({
  user: new FormControl(null, [Validators.required]),
  accessToken: new FormControl(null, [Validators.required]),
  tokenType: new FormControl(null, [Validators.required]),
  expiresIn: new FormControl(null, [Validators.required, Validators.min(0)])
});

export const createUserDtoForm = new FormGroup({
  email: new FormControl(null, [Validators.required, Validators.email]),
  password: new FormControl(null, [Validators.required]),
  yearOfBirth: new FormControl(null, [Validators.required]),
  gender: new FormControl(null, [Validators.required]),
  role: new FormControl(null, []),
  name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
  coop: new FormControl(null, [])
});

export const updateUserDtoForm = new FormGroup({
  email: new FormControl(null, [Validators.email]),
  password: new FormControl(null, []),
  yearOfBirth: new FormControl(null, []),
  gender: new FormControl(null, []),
  role: new FormControl(null, []),
  name: new FormControl(null, [Validators.minLength(3)]),
  coop: new FormControl(null, [])
});

export const createCoopDtoForm = new FormGroup({
  email: new FormControl(null, [Validators.required]),
  name: new FormControl(null, [Validators.required]),
  phone: new FormControl(null, [])
});

export const readCoopDtoForm = new FormGroup({
  id: new FormControl(null, [Validators.required]),
  name: new FormControl(null, [Validators.required]),
  email: new FormControl(null, [Validators.required]),
  phone: new FormControl(null, []),
  users: new FormControl(null, [Validators.required])
});

export const updateCoopDtoForm = new FormGroup({
  email: new FormControl(null, []),
  name: new FormControl(null, []),
  phone: new FormControl(null, [])
});

export const createSingleAnswerDtoForm = new FormGroup({
  key: new FormControl(null, [Validators.required]),
  value: new FormControl(null, [Validators.required])
});

export const createSingleResponseDtoForm = new FormGroup({
  key: new FormControl(null, [Validators.required]),
  value: new FormControl(null, [Validators.required])
});

export const createSingleTextDtoForm = new FormGroup({
  key: new FormControl(null, [Validators.required]),
  value: new FormControl(null, [Validators.required])
});

export const createAnswerDtoForm = new FormGroup({
  questionnaire: new FormControl(null, [Validators.required]),
  answers: new FormControl(null, [Validators.required]),
  results: new FormControl(null, []),
  textResponses: new FormControl(null, []),
  notes: new FormControl(null, [])
});

export const idNameGenderDtoForm = new FormGroup({
  id: new FormControl(null, [Validators.required]),
  name: new FormControl(null, [Validators.required]),
  gender: new FormControl(null, [Validators.required])
});

export const readSingleAnswerDtoForm = new FormGroup({
  key: new FormControl(null, [Validators.required]),
  value: new FormControl(null, [Validators.required])
});

export const readSingleResponseDtoForm = new FormGroup({
  key: new FormControl(null, [Validators.required]),
  value: new FormControl(null, [Validators.required])
});

export const readSingleTextDtoForm = new FormGroup({
  key: new FormControl(null, [Validators.required]),
  value: new FormControl(null, [Validators.required])
});

export const readAnswerDtoForm = new FormGroup({
  id: new FormControl(null, [Validators.required]),
  patient: new FormControl(null, [Validators.required]),
  user: new FormControl(null, []),
  questionnaire: new FormControl(null, [Validators.required]),
  answers: new FormControl(null, [Validators.required]),
  results: new FormControl(null, []),
  textResponses: new FormControl(null, [Validators.required]),
  notes: new FormControl(null, []),
  createdAt: new FormControl(null, [Validators.required])
});

export const updateAnswerDtoForm = new FormGroup({
  questionnaire: new FormControl(null, []),
  answers: new FormControl(null, []),
  results: new FormControl(null, []),
  textResponses: new FormControl(null, []),
  notes: new FormControl(null, [])
});

export const createPatientDtoForm = new FormGroup({
  yearOfBirth: new FormControl(null, [Validators.required]),
  gender: new FormControl(null, [Validators.required]),
  notes: new FormControl(null, [])
});

export const readPatientDtoForm = new FormGroup({
  id: new FormControl(null, [Validators.required]),
  code: new FormControl(null, [Validators.required]),
  yearOfBirth: new FormControl(null, [Validators.required]),
  gender: new FormControl(null, [Validators.required]),
  notes: new FormControl(null, [])
});

export const updatePatientDtoForm = new FormGroup({
  yearOfBirth: new FormControl(null, []),
  gender: new FormControl(null, []),
  notes: new FormControl(null, [])
});

export const readSingleQuestionOptionStringDtoForm = new FormGroup({
  valueType: new FormControl(null, [Validators.required]),
  key: new FormControl(null, [Validators.required]),
  value: new FormControl(null, [Validators.required])
});

export const readSingleQuestionOptionNumberDtoForm = new FormGroup({
  valueType: new FormControl(null, [Validators.required]),
  key: new FormControl(null, [Validators.required]),
  value: new FormControl(null, [Validators.required])
});

export const singleQuestionStringDtoForm = new FormGroup({
  valueType: new FormControl(null, [Validators.required]),
  key: new FormControl(null, [Validators.required]),
  label: new FormControl(null, [Validators.required]),
  required: new FormControl(null, [Validators.required]),
  order: new FormControl(null, [Validators.required]),
  hint: new FormControl(null, []),
  controlType: new FormControl(null, [Validators.required]),
  type: new FormControl(null, [Validators.required]),
  options: new FormControl(null, [Validators.required]),
  value: new FormControl(null, [Validators.required])
});

export const singleQuestionNumberDtoForm = new FormGroup({
  valueType: new FormControl(null, [Validators.required]),
  key: new FormControl(null, [Validators.required]),
  label: new FormControl(null, [Validators.required]),
  required: new FormControl(null, [Validators.required]),
  order: new FormControl(null, [Validators.required]),
  hint: new FormControl(null, []),
  controlType: new FormControl(null, [Validators.required]),
  type: new FormControl(null, [Validators.required]),
  options: new FormControl(null, [Validators.required]),
  value: new FormControl(null, [Validators.required])
});

export const readQuestionDtoForm = new FormGroup({
  questionnaire: new FormControl(null, [Validators.required]),
  name: new FormControl(null, [Validators.required]),
  description: new FormControl(null, []),
  singleQuestion: new FormControl(null, [Validators.required]),
  results: new FormControl(null, [Validators.required]),
  createdAt: new FormControl(null, [])
});
