-- Neonati questionnaire definition
-- Question root
INSERT INTO public."question" (id, questionnaire, name, description)
VALUES ('c1111111-1111-4111-8111-111111111111', 'neonati', 'Neonati', 'Monitoraggio parametri neonatali variabili');

-- Sections (dividers)
INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111111201', 'Parametri vitali di base', 'string', '\\N', 'Parametri vitali di base', false, 0, NULL, 'divider', 'no-divider', 'c1111111-1111-4111-8111-111111111111');

-- Base vitals
INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111111301', NULL, 'number', 'fc', 'Frequenza cardiaca (FC) [bpm]', false, 1, NULL, 'number', '30|230|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111302', NULL, 'number', 'fr', 'Frequenza respiratoria (FR) [atti/min]', false, 2, NULL, 'number', '10|120|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111303', NULL, 'number', 'spo2', 'Saturazione di ossigeno (SpO₂) [%]', false, 3, NULL, 'number', '50|100|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111304', NULL, 'number', 'temp', 'Temperatura corporea [°C]', false, 4, NULL, 'number', '30|42|0.1', 'c1111111-1111-4111-8111-111111111111');

-- Pressione arteriosa non invasiva (sistolica/diastolica)
INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111111305', NULL, 'number', 'pa_sys', 'Pressione arteriosa sistolica (PA sys) [mmHg]', false, 5, NULL, 'number', '30|300|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111306', NULL, 'number', 'pa_dia', 'Pressione arteriosa diastolica (PA dia) [mmHg]', false, 6, NULL, 'number', '15|250|1', 'c1111111-1111-4111-8111-111111111111');

-- Ventilation parameters
INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111111401', 'Parametri ventilatori', 'string', '\\N', 'Parametri ventilatori', false, 10, NULL, 'divider', 'no-divider', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111402', NULL, 'number', 'peep', 'PEEP [cmH2O]', false, 11, NULL, 'number', '0|20|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111403', NULL, 'number', 'pip', 'PIP [cmH2O]', false, 12, NULL, 'number', '5|50|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111404', NULL, 'number', 'pmean', 'Pressione media vie aeree (Pmean) [cmH2O]', false, 13, NULL, 'number', '0|30|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111405', NULL, 'number', 'fio2', 'FiO₂ erogata [0-1]', false, 14, NULL, 'number', '0.21|1|0.01', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111406', NULL, 'number', 'vt', 'Volume corrente (VT) [ml]', false, 15, NULL, 'number', '0|50|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111407', NULL, 'number', 've', 'Ventilazione minuto (VE) [L/min]', false, 16, NULL, 'number', '0|10|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111408', NULL, 'number', 'compliance', 'Compliance polmonare [ml/cmH2O]', false, 17, NULL, 'number', '0|5|0.01', 'c1111111-1111-4111-8111-111111111111');

-- Emogas analysis
INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111111501', 'Analisi emogas', 'string', '\\N', 'Analisi emogas', false, 20, NULL, 'divider', 'no-divider', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111502', NULL, 'number', 'ph', 'pH', false, 21, NULL, 'number', '6.8|7.8|0.01', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111503', NULL, 'number', 'pao2', 'PaO₂ [mmHg]', false, 22, NULL, 'number', '0|200|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111504', NULL, 'number', 'paco2', 'PaCO₂ [mmHg]', false, 23, NULL, 'number', '10|120|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111505', NULL, 'number', 'hco3', 'HCO₃⁻ [mmol/L]', false, 24, NULL, 'number', '5|45|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111506', NULL, 'number', 'lattati', 'Lattati [mmol/L]', false, 25, NULL, 'number', '0|20|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111507', NULL, 'number', 'be', 'Base Excess (BE) [mmol/L]', false, 26, NULL, 'number', '-20|20|0.1', 'c1111111-1111-4111-8111-111111111111');

-- Respiration type
INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111111601', NULL, 'string', 'tipo_respiro', 'Tipologia di respiro', false, 30, NULL, 'dropdown', NULL, 'c1111111-1111-4111-8111-111111111111');

-- Eliminazione
INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111111701', 'Eliminazione', 'string', '\\N', 'Eliminazione', false, 40, NULL, 'divider', 'no-divider', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111702', NULL, 'string', 'evacuazione', 'Evacuazione', false, 41, NULL, 'dropdown', NULL, 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111703', NULL, 'number', 'peso_pannolino', 'Peso pannolino [g]', false, 42, NULL, 'number', '0|500|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111704', NULL, 'number', 'ore_trascorse', 'Ore trascorse dall''ultimo cambio', false, 43, NULL, 'number', '0.5|24|0.5', 'c1111111-1111-4111-8111-111111111111');

-- Metabolici e biochimici / Nutrizione
INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111111801', 'Metabolici e biochimici', 'string', '\\N', 'Parametri metabolici e biochimici', false, 50, NULL, 'divider', 'no-divider', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111802', NULL, 'number', 'glicemia', 'Glicemia [mg/dL]', false, 51, NULL, 'number', '20|300|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111803', NULL, 'number', 'na', 'Sodio (Na⁺) [mmol/L]', false, 52, NULL, 'number', '100|170|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111804', NULL, 'number', 'k', 'Potassio (K⁺) [mmol/L]', false, 53, NULL, 'number', '2|9|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111805', NULL, 'number', 'cl', 'Cloro (Cl⁻) [mmol/L]', false, 54, NULL, 'number', '70|130|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111806', NULL, 'number', 'ca', 'Calcio (Ca²⁺) [mg/dL]', false, 55, NULL, 'number', '5|15|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111807', NULL, 'number', 'mg', 'Magnesio (Mg²⁺) [mg/dL]', false, 56, NULL, 'number', '0.5|5|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111808', NULL, 'number', 'fosfato', 'Fosfato [mg/dL]', false, 57, NULL, 'number', '1|12|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111809', NULL, 'number', 'urea', 'Urea [mg/dL]', false, 58, NULL, 'number', '5|150|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111810', NULL, 'number', 'creatinina', 'Creatinina [mg/dL]', false, 59, NULL, 'number', '0|5|0.01', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111811', NULL, 'number', 'ast', 'AST [U/L]', false, 60, NULL, 'number', '0|500|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111812', NULL, 'number', 'alt', 'ALT [U/L]', false, 61, NULL, 'number', '0|500|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111813', NULL, 'number', 'bilirubina', 'Bilirubina [mg/dL]', false, 62, NULL, 'number', '0|30|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111814', NULL, 'number', 'f_alcalina', 'Fosfatasi alcalina [U/L]', false, 63, NULL, 'number', '0|2000|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111815', NULL, 'number', 'hb', 'Emoglobina (Hb) [g/dL]', false, 64, NULL, 'number', '5|25|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111816', NULL, 'number', 'ht', 'Ematocrito (Ht) [%]', false, 65, NULL, 'number', '10|70|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111817', NULL, 'number', 'leucociti', 'Leucociti [10^9/L]', false, 66, NULL, 'number', '0|50|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111818', NULL, 'number', 'piastrine', 'Piastrine [10^9/L]', false, 67, NULL, 'number', '0|1000|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111819', NULL, 'number', 'pt', 'PT [s]', false, 68, NULL, 'number', '5|60|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111820', NULL, 'number', 'aptt', 'aPTT [s]', false, 69, NULL, 'number', '10|200|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111821', NULL, 'number', 'inr', 'INR', false, 70, NULL, 'number', '0.5|5|0.01', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111822', NULL, 'number', 'fibrinogeno', 'Fibrinogeno [mg/dL]', false, 71, NULL, 'number', '50|1000|1', 'c1111111-1111-4111-8111-111111111111');

-- Peso e nutrizione
INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111111901', 'Nutrizione', 'string', '\\N', 'Nutrizione', false, 80, NULL, 'divider', 'no-divider', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111902', NULL, 'number', 'peso_neonato', 'Peso neonato [kg]', false, 81, NULL, 'number', '0.3|6|0.01', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111903', NULL, 'number', 'cibo_ml', 'Quantità di cibo mangiata [ml]', false, 82, NULL, 'number', '0|300|1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111904', NULL, 'string', 'latte_tipo', 'Tipo latte', false, 83, NULL, 'dropdown', NULL, 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111905', NULL, 'string', 'latte_fortificato', 'Fortificato', false, 84, NULL, 'dropdown', NULL, 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111111906', NULL, 'string', 'note_fortificazione', 'Note sulla fortificazione', false, 85, NULL, 'textbox', 'text', 'c1111111-1111-4111-8111-111111111111');

-- Termoculla
INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111112001', 'Termoculla', 'string', '\\N', 'Termoculla', false, 90, NULL, 'divider', 'no-divider', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111112002', NULL, 'string', 'termoculla', 'Termoculla', false, 91, NULL, 'dropdown', NULL, 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111112003', NULL, 'number', 'termoculla_temp', 'Temperatura termoculla [°C]', false, 92, NULL, 'number', '20|40|0.1', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111112004', NULL, 'number', 'termoculla_umidita', 'Umidità termoculla [%]', false, 93, NULL, 'number', '0|100|1', 'c1111111-1111-4111-8111-111111111111');

-- Accessi
INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111112101', 'Accessi', 'string', '\\N', 'Accessi vascolari', false, 100, NULL, 'divider', 'no-divider', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111112102', NULL, 'string', 'cvo_cao', 'CVO/CAO', false, 101, NULL, 'dropdown', NULL, 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111112103', NULL, 'string', 'note_cvo_cao', 'Note catetere ombelicale', false, 102, NULL, 'textbox', 'text', 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111112104', NULL, 'string', 'accesso_periferico', 'Accesso periferico', false, 103, NULL, 'dropdown', NULL, 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111112105', NULL, 'string', 'note_accesso_periferico', 'Note accesso periferico', false, 104, NULL, 'textbox', 'text', 'c1111111-1111-4111-8111-111111111111');

-- Note generali
INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111112201', NULL, 'string', 'note_generali', 'Note Generali', false, 110, NULL, 'textbox', 'text', 'c1111111-1111-4111-8111-111111111111');

-- Derived results placeholders (optional)
INSERT INTO public."question_single_result" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES
('c1111111-1111-4111-8111-111111113001', NULL, 'number', 'spo2_fio2_ratio', 'Rapporto SpO₂/FiO₂', false, 1, NULL, 'number', NULL, 'c1111111-1111-4111-8111-111111111111'),
('c1111111-1111-4111-8111-111111113002', NULL, 'number', 'diuresi_oraria_ml_kg_h', 'Diuresi oraria stimata [ml/kg/h]', false, 2, NULL, 'number', NULL, 'c1111111-1111-4111-8111-111111111111');

-- Opzioni per tutte le select (inserite dopo tutte le domande per rispettare le foreign key)
INSERT INTO public."question_single_option" (id, value, "valueType", key, "singleQuestionId") VALUES
-- Opzioni per Tipologia di respiro
('c1111111-1111-4111-8111-111111112600', NULL, 'number', '', 'c1111111-1111-4111-8111-111111111601'),
('c1111111-1111-4111-8111-111111112601', '0', 'number', 'Spontaneo', 'c1111111-1111-4111-8111-111111111601'),
('c1111111-1111-4111-8111-111111112602', '1', 'number', 'Supportato', 'c1111111-1111-4111-8111-111111111601'),
('c1111111-1111-4111-8111-111111112603', '2', 'number', 'Ventilato', 'c1111111-1111-4111-8111-111111111601'),

-- Opzioni per Evacuazione
('c1111111-1111-4111-8111-111111112604', NULL, 'number', '', 'c1111111-1111-4111-8111-111111111702'),
('c1111111-1111-4111-8111-111111112605', '0', 'number', 'No', 'c1111111-1111-4111-8111-111111111702'),
('c1111111-1111-4111-8111-111111112606', '1', 'number', 'Si', 'c1111111-1111-4111-8111-111111111702'),

-- Opzioni per Tipo latte
('c1111111-1111-4111-8111-111111112900', NULL, 'number', '', 'c1111111-1111-4111-8111-111111111904'),
('c1111111-1111-4111-8111-111111112901', '0', 'number', 'Latte materno', 'c1111111-1111-4111-8111-111111111904'),
('c1111111-1111-4111-8111-111111112902', '1', 'number', 'Latte artificiale', 'c1111111-1111-4111-8111-111111111904'),

-- Opzioni per Fortificato
('c1111111-1111-4111-8111-111111112903', NULL, 'number', '', 'c1111111-1111-4111-8111-111111111905'),
('c1111111-1111-4111-8111-111111112904', '0', 'number', 'No', 'c1111111-1111-4111-8111-111111111905'),
('c1111111-1111-4111-8111-111111112905', '1', 'number', 'Si', 'c1111111-1111-4111-8111-111111111905'),

-- Opzioni per Termoculla
('c1111111-1111-4111-8111-111111112906', NULL, 'number', '', 'c1111111-1111-4111-8111-111111112002'),
('c1111111-1111-4111-8111-111111112907', '0', 'number', 'No', 'c1111111-1111-4111-8111-111111112002'),
('c1111111-1111-4111-8111-111111112908', '1', 'number', 'Si', 'c1111111-1111-4111-8111-111111112002'),

-- Opzioni per CVO/CAO
('c1111111-1111-4111-8111-111111112909', NULL, 'number', '', 'c1111111-1111-4111-8111-111111112102'),
('c1111111-1111-4111-8111-111111112910', '0', 'number', 'No', 'c1111111-1111-4111-8111-111111112102'),
('c1111111-1111-4111-8111-111111112911', '1', 'number', 'Si', 'c1111111-1111-4111-8111-111111112102'),

-- Opzioni per Accesso periferico
('c1111111-1111-4111-8111-111111112912', NULL, 'number', '', 'c1111111-1111-4111-8111-111111112104'),
('c1111111-1111-4111-8111-111111112913', '0', 'number', 'No', 'c1111111-1111-4111-8111-111111112104'),
('c1111111-1111-4111-8111-111111112914', '1', 'number', 'Si', 'c1111111-1111-4111-8111-111111112104');


