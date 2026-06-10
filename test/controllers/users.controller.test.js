const test = require("node:test");
const assert = require("node:assert");
const sinon = require("sinon");

const User = require("../../src/models/user.model");
const { getUsers, createUser, getUserById, updateUser, deleteUser } = require("../../src/controllers/users.controller");

test.afterEach(() => {
    sinon.restore();
});

test("getUsers restituisce la lista degli utenti", async () => {
    const users = [
        {
            _id: "user-1",
            name: "Mario",
            surname: "Rossi",
            email: "mario.rossi@test.com"
        },
        {
            _id: "user-2",
            name: "Luigi",
            surname: "Verdi",
            email: "luigi.verdi@test.com"
        }
    ];

    const req = {};

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(User, "find").resolves(users);

    await getUsers(req, res, next);

    assert.strictEqual(User.find.calledOnce, true);

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Lista utenti",
        results: 2,
        data: users
    });

    assert.strictEqual(next.notCalled, true);
});

test("createUser crea un utente e risponde con status 201", async () => {
    const req = {
        body: {
            name: "Mario",
            surname: "Rossi",
            email: "mario.rossi@test.com"
        }
    };

    const createdUser = {
        _id: "user-id",
        name: "Mario",
        surname: "Rossi",
        email: "mario.rossi@test.com"
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(User, "findOne").resolves(null);
    sinon.stub(User, "create").resolves(createdUser);

    await createUser(req, res, next);

    assert.strictEqual(User.findOne.calledOnce, true);
    assert.deepStrictEqual(User.findOne.firstCall.args[0], {
        email: "mario.rossi@test.com"
    });

    assert.strictEqual(User.create.calledOnce, true);
    assert.deepStrictEqual(User.create.firstCall.args[0], {
        name: "Mario",
        surname: "Rossi",
        email: "mario.rossi@test.com"
    });

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 201);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Utente creato",
        data: createdUser
    });

    assert.strictEqual(next.notCalled, true);
});

test("createUser restituisce errore 409 se l'email esiste gia", async () => {
    const req = {
        body: {
            name: "Mario",
            surname: "Rossi",
            email: "mario.rossi@test.com"
        }
    };

    const res = {};
    const next = sinon.spy();

    sinon.stub(User, "findOne").resolves({
        _id: "user-id",
        email: "mario.rossi@test.com"
    });

    await createUser(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.statusCode, 409);
});

test("getUserById restituisce un utente se esiste", async () => {
    const user = {
        _id: "user-id",
        name: "Mario",
        surname: "Rossi",
        email: "mario.rossi@test.com"
    };

    const req = {
        params: {
            id: "user-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(User, "findById").resolves(user);

    await getUserById(req, res, next);

    assert.strictEqual(User.findById.calledOnce, true);
    assert.strictEqual(User.findById.firstCall.args[0], "user-id");

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Utente trovato",
        data: user
    });

    assert.strictEqual(next.notCalled, true);
});

test("getUserById restituisce errore 404 se l'utente non esiste", async () => {
    const req = {
        params: {
            id: "user-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(User, "findById").resolves(null);

    await getUserById(req, res, next);

    assert.strictEqual(User.findById.calledOnce, true);
    assert.strictEqual(User.findById.firstCall.args[0], "user-id");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Utente non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("updateUser aggiorna un utente e risponde con status 200", async () => {
    const req = {
        params: {
            id: "user-id"
        },
        body: {
            name: "Mario Updated",
            surname: "Rossi",
            email: "mario.updated@test.com"
        }
    };

    const updatedUser = {
        _id: "user-id",
        name: "Mario Updated",
        surname: "Rossi",
        email: "mario.updated@test.com"
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(User, "findByIdAndUpdate").resolves(updatedUser);

    await updateUser(req, res, next);

    assert.strictEqual(User.findByIdAndUpdate.calledOnce, true);
    assert.strictEqual(User.findByIdAndUpdate.firstCall.args[0], "user-id");
    assert.deepStrictEqual(User.findByIdAndUpdate.firstCall.args[1], req.body);
    assert.deepStrictEqual(User.findByIdAndUpdate.firstCall.args[2], {
        new: true,
        runValidators: true
    });

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Utente aggiornato",
        data: updatedUser
    });

    assert.strictEqual(next.notCalled, true);
});

test("updateUser restituisce errore 404 se l'utente non esiste", async () => {
    const req = {
        params: {
            id: "user-id"
        },
        body: {
            name: "Mario Updated"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(User, "findByIdAndUpdate").resolves(null);

    await updateUser(req, res, next);

    assert.strictEqual(User.findByIdAndUpdate.calledOnce, true);
    assert.strictEqual(User.findByIdAndUpdate.firstCall.args[0], "user-id");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Utente non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("deleteUser elimina un utente e risponde con status 200", async () => {
    const deletedUser = {
        _id: "user-id",
        name: "Mario",
        surname: "Rossi",
        email: "mario.rossi@test.com"
    };

    const req = {
        params: {
            id: "user-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(User, "findByIdAndDelete").resolves(deletedUser);

    await deleteUser(req, res, next);

    assert.strictEqual(User.findByIdAndDelete.calledOnce, true);
    assert.strictEqual(User.findByIdAndDelete.firstCall.args[0], "user-id");

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Utente eliminato",
        data: deletedUser
    });

    assert.strictEqual(next.notCalled, true);
});

test("deleteUser restituisce errore 404 se l'utente non esiste", async () => {
    const req = {
        params: {
            id: "user-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(User, "findByIdAndDelete").resolves(null);

    await deleteUser(req, res, next);

    assert.strictEqual(User.findByIdAndDelete.calledOnce, true);
    assert.strictEqual(User.findByIdAndDelete.firstCall.args[0], "user-id");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Utente non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});
