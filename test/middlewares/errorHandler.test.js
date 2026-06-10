const test = require("node:test");
const assert = require("node:assert");
const sinon = require("sinon");

const errorHandler = require("../../src/middlewares/errorHandler.middleware");

test("errorHandler risponde con lo statusCode e il messaggio dell'errore", () => {
    const error = {
        statusCode: 400,
        message: "Errore di validazione"
    };

    const req = {};

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    errorHandler(error, req, res, next);

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 400);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        success: false,
        message: "Errore di validazione"
    });

    assert.strictEqual(next.notCalled, true);
});

test("errorHandler usa status 500 se l'errore non ha statusCode", () => {
    const error = {
        message: "Errore generico"
    };

    const req = {};

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    errorHandler(error, req, res, next);

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 500);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        success: false,
        message: "Errore generico"
    });

    assert.strictEqual(next.notCalled, true);
});