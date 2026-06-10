const test = require("node:test");
const assert = require("node:assert");
const sinon = require("sinon");

const validateObjectId = require("../../src/middlewares/validateObjectId.middleware");

test("validateObjectId chiama next senza errore se l'id e valido", () => {
    const req = {
        params: {
            id: "507f1f77bcf86cd799439011"
        }
    };

    const res = {};
    const next = sinon.spy();

    validateObjectId(req, res, next);

    assert.strictEqual(next.calledOnce, true);
    assert.strictEqual(next.firstCall.args.length, 0);
});

test("validateObjectId passa un errore a next se l'id non e valido", () => {
    const req = {
        params: {
            id: 123
        }
    };

    const res = {};
    const next = sinon.spy();

    validateObjectId(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "ID non valido");
    assert.strictEqual(error.statusCode, 400);
});