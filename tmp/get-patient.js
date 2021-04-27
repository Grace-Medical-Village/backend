var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var db_1 = require("./utils/db");
var request_1 = require("./utils/request");
var response_1 = require("./utils/response");
var main = function (event) { return __awaiter(_this, void 0, void 0, function () {
    var client, id, conditions, medications, metrics, notes, patient, patientData, getPatientQuery, rows, getPatientConditionsQuery, rows, getPatientMedicationsQuery, rows, getPatientMetricsQuery, rows, getPatientNotesQuery, rows, body, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = db_1.clientBuilder();
                return [4 /*yield*/, client.connect()];
            case 1:
                _a.sent();
                id = request_1.getParameter(event, 'id', true);
                conditions = !!request_1.getParameter(event, 'conditions', false);
                medications = !!request_1.getParameter(event, 'medications', false);
                metrics = !!request_1.getParameter(event, 'metrics', false);
                notes = !!request_1.getParameter(event, 'notes', false);
                patient = !!request_1.getParameter(event, 'patient', false);
                patientData = {};
                if (!patient) return [3 /*break*/, 3];
                getPatientQuery = {
                    name: 'get-patient',
                    text: "select id,\n           first_name,\n           last_name,\n           first_name || ' ' || last_name full_name,\n           birthdate,\n           gender,\n           email,\n           height,\n           mobile,\n           map,\n           country,\n           native_language,\n           native_literacy,\n           smoker\n    from patient\n    where id = $1;",
                    values: [id],
                };
                return [4 /*yield*/, client.query(getPatientQuery)];
            case 2:
                rows = (_a.sent()).rows;
                if (rows.length > 0)
                    patientData.patient = rows[0];
                _a.label = 3;
            case 3:
                if (!(conditions === true)) return [3 /*break*/, 5];
                getPatientConditionsQuery = {
                    name: 'get-patient-conditions',
                    text: "select pc.*, c.condition_name\n      from patient_condition pc\n      inner join condition c on pc.condition_id = c.id\n      where patient_id = $1;",
                    values: [id],
                };
                return [4 /*yield*/, client.query(getPatientConditionsQuery)];
            case 4:
                rows = (_a.sent()).rows;
                patientData.conditions = rows;
                _a.label = 5;
            case 5:
                if (!(medications === true)) return [3 /*break*/, 7];
                getPatientMedicationsQuery = {
                    name: 'get-patient-medication',
                    text: 'select * from patient_medication where patient_id = $1;',
                    values: [id],
                };
                return [4 /*yield*/, client.query(getPatientMedicationsQuery)];
            case 6:
                rows = (_a.sent()).rows;
                patientData.medications = rows;
                _a.label = 7;
            case 7:
                if (!(metrics === true)) return [3 /*break*/, 9];
                getPatientMetricsQuery = {
                    name: 'get-patient-metrics',
                    text: 'select * from patient_metric where patient_id = $1;',
                    values: [id],
                };
                return [4 /*yield*/, client.query(getPatientMetricsQuery)];
            case 8:
                rows = (_a.sent()).rows;
                patientData.metrics = rows;
                _a.label = 9;
            case 9:
                if (!(notes === true)) return [3 /*break*/, 11];
                getPatientNotesQuery = {
                    name: 'get-patient-notes',
                    text: 'select * from patient_note where patient_id = $1;',
                    values: [id],
                };
                return [4 /*yield*/, client.query(getPatientNotesQuery)];
            case 10:
                rows = (_a.sent()).rows;
                patientData.notes = rows;
                _a.label = 11;
            case 11: return [4 /*yield*/, client.end()];
            case 12:
                _a.sent();
                body = {
                    data: patientData,
                };
                response = __assign(__assign({}, response_1.responseBase), { body: JSON.stringify(body) });
                return [2 /*return*/, response];
        }
    });
}); };
exports.main = main;
//# sourceMappingURL=get-patient.js.map