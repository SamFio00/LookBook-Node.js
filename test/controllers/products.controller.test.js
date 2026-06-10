const test = require("node:test");
const assert = require("node:assert");
const sinon = require("sinon");
const fs = require("fs");

const Product = require("../../src/models/product.model");
const {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    addProductImage,
    removeProductImage,
    deleteProduct
} = require("../../src/controllers/products.controller");

test.afterEach(() => {
    sinon.restore();
});

test("getProducts restituisce la lista dei prodotti", async () => {
    const products = [
        {
            _id: "product-1",
            name: "Giacca vintage",
            images: ["uploads/giacca.jpg"]
        },
        {
            _id: "product-2",
            name: "Borsa pelle",
            images: ["uploads/borsa.jpg"]
        }
    ];

    const req = {};

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "find").resolves(products);

    await getProducts(req, res, next);

    assert.strictEqual(Product.find.calledOnce, true);

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Lista prodotti",
        results: 2,
        data: products
    });

    assert.strictEqual(next.notCalled, true);
});

test("createProduct restituisce errore 400 se non ci sono immagini", async () => {
    const req = {
        body: {
            name: "Giacca vintage"
        },
        files: []
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    await createProduct(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Devi caricare almeno un'immagine");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("createProduct crea un prodotto e risponde con status 201", async () => {
    const req = {
        body: {
            name: "Giacca vintage"
        },
        files: [
            {
                path: "uploads/giacca-1.jpg"
            },
            {
                path: "uploads/giacca-2.jpg"
            }
        ]
    };

    const createdProduct = {
        _id: "product-id",
        name: "Giacca vintage",
        images: [
            "uploads/giacca-1.jpg",
            "uploads/giacca-2.jpg"
        ]
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "create").resolves(createdProduct);

    await createProduct(req, res, next);

    assert.strictEqual(Product.create.calledOnce, true);
    assert.deepStrictEqual(Product.create.firstCall.args[0], {
        name: "Giacca vintage",
        images: [
            "uploads/giacca-1.jpg",
            "uploads/giacca-2.jpg"
        ]
    });

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 201);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Prodotto inserito",
        data: createdProduct
    });

    assert.strictEqual(next.notCalled, true);
});

test("getProductById restituisce un prodotto se esiste", async () => {
    const product = {
        _id: "product-id",
        name: "Giacca vintage",
        images: ["uploads/giacca.jpg"]
    };

    const req = {
        params: {
            id: "product-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "findById").resolves(product);

    await getProductById(req, res, next);

    assert.strictEqual(Product.findById.calledOnce, true);
    assert.strictEqual(Product.findById.firstCall.args[0], "product-id");

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Prodotto trovato",
        data: product
    });

    assert.strictEqual(next.notCalled, true);
});

test("getProductById restituisce errore 404 se il prodotto non esiste", async () => {
    const req = {
        params: {
            id: "product-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "findById").resolves(null);

    await getProductById(req, res, next);

    assert.strictEqual(Product.findById.calledOnce, true);
    assert.strictEqual(Product.findById.firstCall.args[0], "product-id");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Prodotto non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("updateProduct aggiorna il nome di un prodotto e risponde con status 200", async () => {
    const req = {
        params: {
            id: "product-id"
        },
        body: {
            name: "Giacca aggiornata"
        }
    };

    const updatedProduct = {
        _id: "product-id",
        name: "Giacca aggiornata",
        images: ["uploads/giacca.jpg"]
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "findByIdAndUpdate").resolves(updatedProduct);

    await updateProduct(req, res, next);

    assert.strictEqual(Product.findByIdAndUpdate.calledOnce, true);
    assert.strictEqual(Product.findByIdAndUpdate.firstCall.args[0], "product-id");
    assert.deepStrictEqual(Product.findByIdAndUpdate.firstCall.args[1], {
        name: "Giacca aggiornata"
    });
    assert.deepStrictEqual(Product.findByIdAndUpdate.firstCall.args[2], {
        new: true,
        runValidators: true
    });

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Prodotto aggiornato",
        data: updatedProduct
    });

    assert.strictEqual(next.notCalled, true);
});

test("updateProduct restituisce errore 404 se il prodotto non esiste", async () => {
    const req = {
        params: {
            id: "product-id"
        },
        body: {
            name: "Giacca aggiornata"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "findByIdAndUpdate").resolves(null);

    await updateProduct(req, res, next);

    assert.strictEqual(Product.findByIdAndUpdate.calledOnce, true);
    assert.strictEqual(Product.findByIdAndUpdate.firstCall.args[0], "product-id");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Prodotto non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("addProductImage aggiunge immagini a un prodotto e risponde con status 200", async () => {
    const product = {
        _id: "product-id",
        name: "Giacca vintage",
        images: ["uploads/giacca-1.jpg"],
        save: sinon.stub().resolves()
    };

    const req = {
        params: {
            id: "product-id"
        },
        files: [
            {
                path: "uploads/giacca-2.jpg"
            },
            {
                path: "uploads/giacca-3.jpg"
            }
        ]
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "findById").resolves(product);

    await addProductImage(req, res, next);

    assert.strictEqual(Product.findById.calledOnce, true);
    assert.strictEqual(Product.findById.firstCall.args[0], "product-id");

    assert.deepStrictEqual(product.images, [
        "uploads/giacca-1.jpg",
        "uploads/giacca-2.jpg",
        "uploads/giacca-3.jpg"
    ]);

    assert.strictEqual(product.save.calledOnce, true);

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Immagini aggiunte",
        data: product
    });

    assert.strictEqual(next.notCalled, true);
});

test("addProductImage restituisce errore 400 se non ci sono immagini", async () => {
    const req = {
        params: {
            id: "product-id"
        },
        files: []
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    await addProductImage(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Devi caricare almeno un'immagine");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("addProductImage restituisce errore 404 se il prodotto non esiste", async () => {
    const req = {
        params: {
            id: "product-id"
        },
        files: [
            {
                path: "uploads/giacca.jpg"
            }
        ]
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "findById").resolves(null);

    await addProductImage(req, res, next);

    assert.strictEqual(Product.findById.calledOnce, true);
    assert.strictEqual(Product.findById.firstCall.args[0], "product-id");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Prodotto non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("removeProductImage rimuove un'immagine e risponde con status 200", async () => {
    const product = {
        _id: "product-id",
        name: "Giacca vintage",
        images: [
            "uploads/giacca-1.jpg",
            "uploads/giacca-2.jpg"
        ],
        save: sinon.stub().resolves()
    };

    const req = {
        params: {
            id: "product-id"
        },
        body: {
            image: "uploads/giacca-1.jpg"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "findById").resolves(product);
    sinon.stub(fs, "unlink").callsFake((path, callback) => callback(null));

    await removeProductImage(req, res, next);

    assert.strictEqual(Product.findById.calledOnce, true);
    assert.strictEqual(Product.findById.firstCall.args[0], "product-id");

    assert.strictEqual(fs.unlink.calledOnce, true);
    assert.strictEqual(fs.unlink.firstCall.args[0], "uploads/giacca-1.jpg");

    assert.deepStrictEqual(product.images, [
        "uploads/giacca-2.jpg"
    ]);

    assert.strictEqual(product.save.calledOnce, true);

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Immagine rimossa",
        data: product
    });

    assert.strictEqual(next.notCalled, true);
});

test("removeProductImage restituisce errore 400 se manca l'immagine nel body", async () => {
    const req = {
        params: {
            id: "product-id"
        },
        body: {}
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    await removeProductImage(req, res, next);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Immagine obbligatoria");
    assert.strictEqual(error.statusCode, 400);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("removeProductImage restituisce errore 404 se il prodotto non esiste", async () => {
    const req = {
        params: {
            id: "product-id"
        },
        body: {
            image: "uploads/giacca-1.jpg"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "findById").resolves(null);

    await removeProductImage(req, res, next);

    assert.strictEqual(Product.findById.calledOnce, true);
    assert.strictEqual(Product.findById.firstCall.args[0], "product-id");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Prodotto non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("removeProductImage restituisce errore 404 se l'immagine non esiste nel prodotto", async () => {
    const product = {
        _id: "product-id",
        name: "Giacca vintage",
        images: ["uploads/giacca-2.jpg"],
        save: sinon.stub().resolves()
    };

    const req = {
        params: {
            id: "product-id"
        },
        body: {
            image: "uploads/giacca-1.jpg"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "findById").resolves(product);

    await removeProductImage(req, res, next);

    assert.strictEqual(Product.findById.calledOnce, true);

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Immagine non trovata");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(product.save.notCalled, true);
    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});

test("deleteProduct elimina un prodotto, rimuove le immagini e risponde con status 200", async () => {
    const product = {
        _id: "product-id",
        name: "Giacca vintage",
        images: [
            "uploads/giacca-1.jpg",
            "uploads/giacca-2.jpg"
        ]
    };

    const req = {
        params: {
            id: "product-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "findById").resolves(product);
    sinon.stub(Product, "findByIdAndDelete").resolves(product);
    sinon.stub(fs, "unlink").callsFake((path, callback) => callback(null));

    await deleteProduct(req, res, next);

    assert.strictEqual(Product.findById.calledOnce, true);
    assert.strictEqual(Product.findById.firstCall.args[0], "product-id");

    assert.strictEqual(fs.unlink.callCount, 2);
    assert.strictEqual(fs.unlink.firstCall.args[0], "uploads/giacca-1.jpg");
    assert.strictEqual(fs.unlink.secondCall.args[0], "uploads/giacca-2.jpg");

    assert.strictEqual(Product.findByIdAndDelete.calledOnce, true);
    assert.strictEqual(Product.findByIdAndDelete.firstCall.args[0], "product-id");

    assert.strictEqual(res.status.calledOnce, true);
    assert.strictEqual(res.status.firstCall.args[0], 200);

    assert.strictEqual(res.json.calledOnce, true);
    assert.deepStrictEqual(res.json.firstCall.args[0], {
        message: "Prodotto eliminato",
        data: product
    });

    assert.strictEqual(next.notCalled, true);
});

test("deleteProduct restituisce errore 404 se il prodotto non esiste", async () => {
    const req = {
        params: {
            id: "product-id"
        }
    };

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    };

    const next = sinon.spy();

    sinon.stub(Product, "findById").resolves(null);

    await deleteProduct(req, res, next);

    assert.strictEqual(Product.findById.calledOnce, true);
    assert.strictEqual(Product.findById.firstCall.args[0], "product-id");

    assert.strictEqual(next.calledOnce, true);

    const error = next.firstCall.args[0];

    assert.strictEqual(error.message, "Prodotto non trovato");
    assert.strictEqual(error.statusCode, 404);

    assert.strictEqual(res.status.notCalled, true);
    assert.strictEqual(res.json.notCalled, true);
});