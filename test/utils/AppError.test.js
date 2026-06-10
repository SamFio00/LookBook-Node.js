const test = require("node:test");
const assert = require("node:assert");

const AppError = require("../../src/utils/AppError");

test("AppError crea un errore con messaggio e statusCode", () => {
    const error = new AppError("ID non valido", 400);

    assert.strictEqual(error.message, "ID non valido");
    assert.strictEqual(error.statusCode, 400);
    assert.ok(error instanceof Error);
});