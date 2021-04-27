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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResponse = exports.responseBase = exports.headers = void 0;
exports.headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};
var status = {
    statusCode: 200,
    statusText: 'OK',
};
exports.responseBase = __assign(__assign({}, status), { headers: exports.headers, body: '{}' });
var buildResponse = function (data) {
    return __assign(__assign({}, exports.responseBase), { body: JSON.stringify(data) });
};
exports.buildResponse = buildResponse;
//# sourceMappingURL=response.js.map