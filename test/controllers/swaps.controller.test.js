const test = require("node:test");
const assert = require("node:assert");
const sinon = require("sinon");

const Swap = require("../../src/models/swap.model");
const User = require("../../src/models/user.model");
const Product = require("../../src/models/product.model");

const {
    getSwaps,
    createSwap,
    updateSwap,
    deleteSwap,
    acceptSwap,
    rejectSwap
} = require("../../src/controllers/swaps.controller");

test.afterEach(() => {
    sinon.restore();
});

const createPopulateQuery = (result) => {
    const query = {
        populate: sinon.stub()
    };

    query.populate.onCall(0).returns(query);
    query.populate.onCall(1).returns(query);
    query.populate.onCall(2).returns(query);
    query.populate.onCall(3).resolves(result);

    return query;
};

test("getSwaps restituisce la lista degli swap senza filtri", async () => {
    const swaps = [
        {
            _id: "swap-1",
            status: "pending"
        },
        {
            _id: "swap-2",
            status: "accepted"
        }
    ];

    const req = {
        query: {}
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    const query = createPopulateQuery(swaps);

    sinon.stub(Swap, "find").returns(query);

    await getSwaps(req, res, next);

    assert.strictEqual(Swap.find.calledOnce, true);
    assert.deepStrictEqual(Swap.find.firstCall.args[0], {});

    assert.strictEqual(query.populate.callCount, 4);

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Lista swaps",
        results: 2,
        data: swaps
    });

    assert.strictEqual(next.notCalled, true);
});

test("getSwaps restituisce errore 400 se lo status non e valido", async () => {
    const req = {
        query: {
            status: "invalid"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    await getSwaps(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Stato non valido");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("getSwaps restituisce errore 400 se la data non e valida", async () => {
    const req = {
        query: {
            date: "10-06-2026"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    await getSwaps(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Data non valida, formato: YYYY-MM-DD");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("createSwap restituisce errore 400 se mancano dati obbligatori", async () => {
    const req = {
        body: {
            requesterUser: "user-1",
            receiverUser: "user-2"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    await createSwap(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Dati mancanti");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("createSwap restituisce errore 400 se requesterUser e receiverUser sono uguali", async () => {
    const req = {
        body: {
            requesterUser: "user-1",
            receiverUser: "user-1",
            requesterProduct: "product-1",
            receiverProduct: "product-2"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    await createSwap(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Utenti uguali non permessi");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("createSwap restituisce errore 400 se requesterProduct e receiverProduct sono uguali", async () => {
    const req = {
        body: {
            requesterUser: "user-1",
            receiverUser: "user-2",
            requesterProduct: "product-1",
            receiverProduct: "product-1"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    await createSwap(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Prodotti uguali non permessi");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("createSwap restituisce errore 404 se uno o piu utenti non esistono", async () => {
    const req = {
        body: {
            requesterUser: "user-1",
            receiverUser: "user-2",
            requesterProduct: "product-1",
            receiverProduct: "product-2"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(User, "findById");
    User.findById.onCall(0).resolves({ _id: "user-1" });
    User.findById.onCall(1).resolves(null);

    await createSwap(req, res, next);

    assert.strictEqual(User.findById.callCount, 2);
    assert.strictEqual(User.findById.firstCall.args[0], "user-1");
    assert.strictEqual(User.findById.secondCall.args[0], "user-2");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Uno o più utenti non trovati");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("createSwap restituisce errore 404 se uno o piu prodotti non esistono", async () => {
    const req = {
        body: {
            requesterUser: "user-1",
            receiverUser: "user-2",
            requesterProduct: "product-1",
            receiverProduct: "product-2"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(User, "findById");
    User.findById.onCall(0).resolves({ _id: "user-1" });
    User.findById.onCall(1).resolves({ _id: "user-2" });

    sinon.stub(Product, "findById");
    Product.findById.onCall(0).resolves({ _id: "product-1" });
    Product.findById.onCall(1).resolves(null);

    await createSwap(req, res, next);

    assert.strictEqual(User.findById.callCount, 2);
    assert.strictEqual(Product.findById.callCount, 2);

    assert.strictEqual(Product.findById.firstCall.args[0], "product-1");
    assert.strictEqual(Product.findById.secondCall.args[0], "product-2");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Uno o più prodotti non trovati");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("createSwap crea uno swap e risponde con status 201", async () => {
    const req = {
        body: {
            requesterUser: "user-1",
            receiverUser: "user-2",
            requesterProduct: "product-1",
            receiverProduct: "product-2"
        }
    };

    const createdSwap = {
        _id: "swap-id",
        requesterUser: "user-1",
        receiverUser: "user-2",
        requesterProduct: "product-1",
        receiverProduct: "product-2",
        status: "pending"
    };

    const populatedSwap = {
        _id: "swap-id",
        requesterUser: {
            _id: "user-1",
            name: "Mario"
        },
        receiverUser: {
            _id: "user-2",
            name: "Luigi"
        },
        requesterProduct: {
            _id: "product-1",
            name: "Giacca"
        },
        receiverProduct: {
            _id: "product-2",
            name: "Borsa"
        },
        status: "pending"
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(User, "findById");
    User.findById.onCall(0).resolves({ _id: "user-1" });
    User.findById.onCall(1).resolves({ _id: "user-2" });

    sinon.stub(Product, "findById");
    Product.findById.onCall(0).resolves({ _id: "product-1" });
    Product.findById.onCall(1).resolves({ _id: "product-2" });

    sinon.stub(Swap, "create").resolves(createdSwap);

    const query = createPopulateQuery(populatedSwap);
    sinon.stub(Swap, "findById").returns(query);

    await createSwap(req, res, next);

    assert.strictEqual(User.findById.callCount, 2);
    assert.strictEqual(Product.findById.callCount, 2);

    assert.strictEqual(Swap.create.calledOnce, true);
    assert.deepStrictEqual(Swap.create.firstCall.args[0], {
        requesterUser: "user-1",
        receiverUser: "user-2",
        requesterProduct: "product-1",
        receiverProduct: "product-2"
    });

    assert.strictEqual(Swap.findById.calledOnce, true);
    assert.strictEqual(Swap.findById.firstCall.args[0], "swap-id");

    assert.strictEqual(query.populate.callCount, 4);

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 201);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Swap creato",
        data: populatedSwap
    });

    assert.strictEqual(next.notCalled, true);
});

test("updateSwap aggiorna uno swap e risponde con status 200", async () => {
    const swap = {
        _id: "swap-id",
        status: "pending",
        requesterUser: { toString: () => "user-1" },
        requesterProduct: { toString: () => "product-1" },
        receiverProduct: { toString: () => "product-2" },
        save: sinon.stub().resolves()
    };

    const populatedSwap = {
        _id: "swap-id",
        receiverUser: { _id: "user-3", name: "Peach" },
        status: "pending"
    };

    const req = {
        params: { id: "swap-id" },
        body: { receiverUser: "user-3" }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    const query = createPopulateQuery(populatedSwap);

    sinon.stub(Swap, "findById");
    Swap.findById.onCall(0).resolves(swap);
    Swap.findById.onCall(1).returns(query);

    sinon.stub(User, "findById").resolves({ _id: "user-3" });

    await updateSwap(req, res, next);

    assert.strictEqual(Swap.findById.callCount, 2);
    assert.strictEqual(Swap.findById.firstCall.args[0], "swap-id");
    assert.strictEqual(Swap.findById.secondCall.args[0], "swap-id");

    assert.strictEqual(User.findById.calledOnce, true);
    assert.strictEqual(User.findById.firstCall.args[0], "user-3");

    assert.strictEqual(swap.save.calledOnce, true);
    assert.strictEqual(query.populate.callCount, 4);

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Swap aggiornato",
        data: populatedSwap
    });

    assert.strictEqual(next.notCalled, true);
});

test("updateSwap restituisce errore 400 se il body è vuoto", async () => {
    const req = {
        params: { id: "swap-id" },
        body: {}
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    await updateSwap(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Nessun dato da aggiornare");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("updateSwap restituisce errore 400 se il campo non è aggiornabile", async () => {
    const req = {
        params: { id: "swap-id" },
        body: { requesterUser: "user-1" }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    await updateSwap(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Campo non aggiornabile");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("updateSwap restituisce errore 404 se lo swap non esiste", async () => {
    const req = {
        params: { id: "swap-id" },
        body: { receiverUser: "user-3" }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Swap, "findById").resolves(null);

    await updateSwap(req, res, next);

    assert.strictEqual(Swap.findById.calledOnce, true);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Swap non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("updateSwap restituisce errore 400 se lo swap non è pending", async () => {
    const swap = {
        _id: "swap-id",
        status: "accepted",
        save: sinon.stub().resolves()
    };

    const req = {
        params: { id: "swap-id" },
        body: { receiverUser: "user-3" }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Swap, "findById").resolves(swap);

    await updateSwap(req, res, next);

    assert.strictEqual(Swap.findById.calledOnce, true);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Non puoi modificare uno swap già accettato o rifiutato");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(swap.save.notCalled, true);
    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("updateSwap restituisce errore 404 se il nuovo receiverUser non esiste", async () => {
    const swap = {
        _id: "swap-id",
        status: "pending",
        requesterUser: { toString: () => "user-1" },
        save: sinon.stub().resolves()
    };

    const req = {
        params: { id: "swap-id" },
        body: { receiverUser: "user-99" }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Swap, "findById").resolves(swap);
    sinon.stub(User, "findById").resolves(null);

    await updateSwap(req, res, next);

    assert.strictEqual(User.findById.calledOnce, true);
    assert.strictEqual(User.findById.firstCall.args[0], "user-99");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Utente non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(swap.save.notCalled, true);
    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("updateSwap restituisce errore 400 se il nuovo receiverUser coincide con requesterUser", async () => {
    const swap = {
        _id: "swap-id",
        status: "pending",
        requesterUser: { toString: () => "user-1" },
        save: sinon.stub().resolves()
    };

    const req = {
        params: { id: "swap-id" },
        body: { receiverUser: "user-1" }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Swap, "findById").resolves(swap);
    sinon.stub(User, "findById").resolves({ _id: "user-1" });

    await updateSwap(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Utenti uguali non permessi");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(swap.save.notCalled, true);
    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("updateSwap restituisce errore 404 se il nuovo requesterProduct non esiste", async () => {
    const swap = {
        _id: "swap-id",
        status: "pending",
        requesterProduct: { toString: () => "product-1" },
        receiverProduct: { toString: () => "product-2" },
        save: sinon.stub().resolves()
    };

    const req = {
        params: { id: "swap-id" },
        body: { requesterProduct: "product-99" }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Swap, "findById").resolves(swap);
    sinon.stub(Product, "findById").resolves(null);

    await updateSwap(req, res, next);

    assert.strictEqual(Product.findById.calledOnce, true);
    assert.strictEqual(Product.findById.firstCall.args[0], "product-99");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Prodotto non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(swap.save.notCalled, true);
    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("updateSwap restituisce errore 400 se requesterProduct e receiverProduct diventano uguali", async () => {
    const swap = {
        _id: "swap-id",
        status: "pending",
        requesterProduct: { toString: () => "product-1" },
        receiverProduct: { toString: () => "product-1" },
        save: sinon.stub().resolves()
    };

    const req = {
        params: { id: "swap-id" },
        body: { requesterProduct: "product-1" }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Swap, "findById").resolves(swap);
    sinon.stub(Product, "findById").resolves({ _id: "product-1" });

    await updateSwap(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Prodotti uguali non permessi");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(swap.save.notCalled, true);
    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("deleteSwap elimina uno swap e risponde con status 200", async () => {
    const deletedSwap = {
        _id: "swap-id",
        status: "pending"
    };

    const req = {
        params: {
            id: "swap-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Swap, "findByIdAndDelete").resolves(deletedSwap);

    await deleteSwap(req, res, next);

    assert.strictEqual(Swap.findByIdAndDelete.calledOnce, true);
    assert.strictEqual(Swap.findByIdAndDelete.firstCall.args[0], "swap-id");

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Swap eliminato",
        data: deletedSwap
    });

    assert.strictEqual(next.notCalled, true);
});

test("deleteSwap restituisce errore 404 se lo swap non esiste", async () => {
    const req = {
        params: {
            id: "swap-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Swap, "findByIdAndDelete").resolves(null);

    await deleteSwap(req, res, next);

    assert.strictEqual(Swap.findByIdAndDelete.calledOnce, true);
    assert.strictEqual(Swap.findByIdAndDelete.firstCall.args[0], "swap-id");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Swap non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("acceptSwap accetta uno swap pending e risponde con status 200", async () => {
    const swap = {
        _id: "swap-id",
        status: "pending",
        save: sinon.stub().resolves()
    };

    const populatedSwap = {
        _id: "swap-id",
        status: "accepted"
    };

    const req = {
        params: {
            id: "swap-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    const query = createPopulateQuery(populatedSwap);

    sinon.stub(Swap, "findById");
    Swap.findById.onCall(0).resolves(swap);
    Swap.findById.onCall(1).returns(query);

    await acceptSwap(req, res, next);

    assert.strictEqual(Swap.findById.callCount, 2);
    assert.strictEqual(Swap.findById.firstCall.args[0], "swap-id");
    assert.strictEqual(Swap.findById.secondCall.args[0], "swap-id");

    assert.strictEqual(swap.status, "accepted");
    assert.strictEqual(swap.save.calledOnce, true);

    assert.strictEqual(query.populate.callCount, 4);

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Swap accepted",
        data: populatedSwap
    });

    assert.strictEqual(next.notCalled, true);
});

test("acceptSwap restituisce errore 404 se lo swap non esiste", async () => {
    const req = {
        params: {
            id: "swap-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Swap, "findById").resolves(null);

    await acceptSwap(req, res, next);

    assert.strictEqual(Swap.findById.calledOnce, true);
    assert.strictEqual(Swap.findById.firstCall.args[0], "swap-id");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Swap non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("acceptSwap restituisce errore 400 se lo swap non e pending", async () => {
    const swap = {
        _id: "swap-id",
        status: "accepted",
        save: sinon.stub().resolves()
    };

    const req = {
        params: {
            id: "swap-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Swap, "findById").resolves(swap);

    await acceptSwap(req, res, next);

    assert.strictEqual(Swap.findById.calledOnce, true);
    assert.strictEqual(Swap.findById.firstCall.args[0], "swap-id");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Swap già accettato o rifiutato");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(swap.save.notCalled, true);
    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("rejectSwap rifiuta uno swap pending e risponde con status 200", async () => {
    const swap = {
        _id: "swap-id",
        status: "pending",
        save: sinon.stub().resolves()
    };

    const populatedSwap = {
        _id: "swap-id",
        status: "rejected"
    };

    const req = {
        params: {
            id: "swap-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    const query = createPopulateQuery(populatedSwap);

    sinon.stub(Swap, "findById");
    Swap.findById.onCall(0).resolves(swap);
    Swap.findById.onCall(1).returns(query);

    await rejectSwap(req, res, next);

    assert.strictEqual(Swap.findById.callCount, 2);
    assert.strictEqual(Swap.findById.firstCall.args[0], "swap-id");
    assert.strictEqual(Swap.findById.secondCall.args[0], "swap-id");

    assert.strictEqual(swap.status, "rejected");
    assert.strictEqual(swap.save.calledOnce, true);

    assert.strictEqual(query.populate.callCount, 4);

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Swap rejected",
        data: populatedSwap
    });

    assert.strictEqual(next.notCalled, true);
});