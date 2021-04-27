Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestBodyValues = exports.getRequestBodyValue = exports.getRequestBodyKeys = exports.getParameter = exports.checkIso8601Format = exports.buildValsFromKeys = exports.buildSetStatment = void 0;
var buildSetStatment = function (event, o) {
    var statement = [];
    Object.entries(JSON.parse(event.body)).forEach(function (entry) {
        var k = entry[0];
        var v = entry[1];
        if (!o.includes(k)) {
            typeof v === 'string'
                ? statement.push(k + " = '" + v + "'")
                : statement.push(k + " = " + v);
        }
    });
    return statement;
};
exports.buildSetStatment = buildSetStatment;
var iso8601Regex = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/);
var buildValsFromKeys = function (keys) {
    return keys.map(function (_, index) { return "$" + (index + 1); });
};
exports.buildValsFromKeys = buildValsFromKeys;
var checkIso8601Format = function (date) {
    return iso8601Regex.test(date);
};
exports.checkIso8601Format = checkIso8601Format;
var getParameter = function (event, key, required) {
    var _a;
    var value = null;
    if (event.queryStringParameters !== null)
        value = (_a = event === null || event === void 0 ? void 0 : event.queryStringParameters[key]) !== null && _a !== void 0 ? _a : null;
    if (required && !value)
        console.error("'" + key + "' is a required parameter");
    return value;
};
exports.getParameter = getParameter;
var getRequestBodyKeys = function (event) {
    return Object.keys(JSON.parse(event.body));
};
exports.getRequestBodyKeys = getRequestBodyKeys;
var getRequestBodyValue = function (event, key) {
    var _a;
    var body = JSON.parse(event === null || event === void 0 ? void 0 : event.body);
    var value = (_a = body[key]) !== null && _a !== void 0 ? _a : null;
    if (!value)
        console.error("'" + key + "' is required in the request body");
    return value;
};
exports.getRequestBodyValue = getRequestBodyValue;
// TODO
// export const getRequestBodyString: GetRequestBodyString = (event, key, required) => {
//   const value: Value = getRequestBodyValue(event, key);
//   if (typeof value !== 'string') throw Error('TODO');
//   if (required && value.length() === 0) return;
//   return value.trim();
// };
// export const getRequestBodyNumber: string = (event, key) => {
//   const value: Value = getRequestBodyValue(event, key);
//   if (typeof value !== 'string') throw Error('TODO');
//   return value;
// };
var getRequestBodyValues = function (event) {
    return Object.values(JSON.parse(event.body));
};
exports.getRequestBodyValues = getRequestBodyValues;
//# sourceMappingURL=request.js.map