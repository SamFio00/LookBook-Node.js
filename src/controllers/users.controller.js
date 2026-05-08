let users = []; // "database" temporaneo

// GET all users
const getUsers = (req, res) => {
  res.json({
    message: "Lista utenti",
    data: users
  });
};

// POST create user
const createUser = (req, res) => {
  const { name, surname, email } = req.body;

  // controllo base
  if (!name || !surname || !email) {
    return res.status(400).json({
      message: "Tutti i campi sono obbligatori"
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    surname,
    email
  };

  users.push(newUser);

  res.status(201).json({
    message: "Utente creato",
    data: newUser
  });
};

const getUserById = (req, res) => {
    
    const id = parseInt(req.params.id);

    const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      message: "Utente non trovato"
    });
    }

    res.json({
        message: "Utente trovato",
        data: user
    });
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);

    const { name, surname, email } = req.body;

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            message: "Utente non trovato"
        });
    }

    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (email) user.email = email;

    res.json({
        message: "Utente aggiornato",
        data: user
    });
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Utente non trovato"
        });
    }

    const deletedUser = users.splice(index, 1);

    res.json({
        message: "Utente eliminato",
        data: deletedUser[0]
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};