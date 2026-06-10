const test = require("node:test");
const assert = require("node:assert");
const sinon = require("sinon");

const asyncHandler = require("../../src/utils/asyncHandler");

test("asyncHandler passa gli errori a next", async () => {
    const error = new Error("Errore test");
    const req = {};
    const res = {};
    const next = sinon.spy();

    const controller = asyncHandler(async () => {
        throw error;
    });

    await controller(req, res, next);

    assert.strictEqual(next.calledOnce, true);
    assert.strictEqual(next.firstCall.args[0], error);
});