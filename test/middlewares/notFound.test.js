const test = require("node:test");
const assert = require("node:assert");
const sinon = require("sinon");

const notFound = require("../../src/middlewares/notFound.middleware");

test("notFound passa a next un errore 404", () => {
    const req = {};
    const res = {};
    const next = sinon.spy();

    notFound(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Route non trovata");
    assert.strictEqual(error.statusCode, 404);
});