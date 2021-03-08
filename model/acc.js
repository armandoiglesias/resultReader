// Generated by https://quicktype.io

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toResult(json) {
    return cast(JSON.parse(json), r("Result"));
}

function resultToJson(value) {
    return JSON.stringify(uncast(value, r("Result")), null, 2);
}

function invalidValue(typ, val) {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ) {
    if (typ.jsonToJS === undefined) {
        var map = {};
        typ.props.forEach((p) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ) {
    if (typ.jsToJSON === undefined) {
        var map = {};
        typ.props.forEach((p) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val, typ, getProps) {
    function transformPrimitive(typ, val) {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val);
    }

    function transformUnion(typs, val) {
        // val must validate against one typ in typs
        var l = typs.length;
        for (var i = 0; i < l; i++) {
            var typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases, val) {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ, val) {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformObject(props, additional, val) {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        var result = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    return transformPrimitive(typ, val);
}

function cast(val, typ) {
    return transform(val, typ, jsonToJSProps);
}

function uncast(val, typ) {
    return transform(val, typ, jsToJSONProps);
}

function a(typ) {
    return { arrayItems: typ };
}

function u(...typs) {
    return { unionMembers: typs };
}

function o(props, additional) {
    return { props, additional };
}

function m(additional) {
    return { props: [], additional };
}

function r(name) {
    return { ref: name };
}

const typeMap = {
    "Result": o([
        { json: "sessionType", js: "sessionType", typ: "" },
        { json: "trackName", js: "trackName", typ: "" },
        { json: "sessionIndex", js: "sessionIndex", typ: 0 },
        { json: "raceWeekendIndex", js: "raceWeekendIndex", typ: 0 },
        { json: "metaData", js: "metaData", typ: "" },
        { json: "serverName", js: "serverName", typ: "" },
        { json: "sessionResult", js: "sessionResult", typ: r("SessionResult") },
        { json: "laps", js: "laps", typ: a(r("Lap")) },
        { json: "penalties", js: "penalties", typ: a(r("Penalty")) },
        { json: "post_race_penalties", js: "post_race_penalties", typ: a("any") },
    ], false),
    "Lap": o([
        { json: "carId", js: "carId", typ: 0 },
        { json: "driverIndex", js: "driverIndex", typ: 0 },
        { json: "laptime", js: "laptime", typ: 0 },
        { json: "isValidForBest", js: "isValidForBest", typ: true },
        { json: "splits", js: "splits", typ: a(0) },
    ], false),
    "Penalty": o([
        { json: "carId", js: "carId", typ: 0 },
        { json: "driverIndex", js: "driverIndex", typ: 0 },
        { json: "reason", js: "reason", typ: "" },
        { json: "penalty", js: "penalty", typ: "" },
        { json: "penaltyValue", js: "penaltyValue", typ: 0 },
        { json: "violationInLap", js: "violationInLap", typ: 0 },
        { json: "clearedInLap", js: "clearedInLap", typ: 0 },
    ], false),
    "SessionResult": o([
        { json: "bestlap", js: "bestlap", typ: 0 },
        { json: "bestSplits", js: "bestSplits", typ: a(0) },
        { json: "isWetSession", js: "isWetSession", typ: 0 },
        { json: "type", js: "type", typ: 0 },
        { json: "leaderBoardLines", js: "leaderBoardLines", typ: a(r("LeaderBoardLine")) },
    ], false),
    "LeaderBoardLine": o([
        { json: "car", js: "car", typ: r("Car") },
        { json: "currentDriver", js: "currentDriver", typ: r("Driver") },
        { json: "currentDriverIndex", js: "currentDriverIndex", typ: 0 },
        { json: "timing", js: "timing", typ: r("Timing") },
        { json: "missingMandatoryPitstop", js: "missingMandatoryPitstop", typ: 0 },
        { json: "driverTotalTimes", js: "driverTotalTimes", typ: a(3.14) },
    ], false),
    "Car": o([
        { json: "carId", js: "carId", typ: 0 },
        { json: "raceNumber", js: "raceNumber", typ: 0 },
        { json: "carModel", js: "carModel", typ: 0 },
        { json: "cupCategory", js: "cupCategory", typ: 0 },
        { json: "teamName", js: "teamName", typ: "" },
        { json: "nationality", js: "nationality", typ: 0 },
        { json: "carGuid", js: "carGuid", typ: 0 },
        { json: "teamGuid", js: "teamGuid", typ: 0 },
        { json: "drivers", js: "drivers", typ: a(r("Driver")) },
    ], false),
    "Driver": o([
        { json: "firstName", js: "firstName", typ: "" },
        { json: "lastName", js: "lastName", typ: "" },
        { json: "shortName", js: "shortName", typ: "" },
        { json: "playerId", js: "playerId", typ: "" },
    ], false),
    "Timing": o([
        { json: "lastLap", js: "lastLap", typ: 0 },
        { json: "lastSplits", js: "lastSplits", typ: a(0) },
        { json: "bestLap", js: "bestLap", typ: 0 },
        { json: "bestSplits", js: "bestSplits", typ: a(0) },
        { json: "totalTime", js: "totalTime", typ: 0 },
        { json: "lapCount", js: "lapCount", typ: 0 },
        { json: "lastSplitId", js: "lastSplitId", typ: 0 },
    ], false),
};

module.exports = {
    "resultToJson": resultToJson,
    "toResult": toResult,
};