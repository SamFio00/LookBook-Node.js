# Lookbook Node.js

## Descrizione

Lookbook Node.js è una REST API sviluppata con Node.js, Express e MongoDB che consente di gestire utenti, prodotti e ordini di scambio (swap).

L'applicazione permette di:

- Creare, visualizzare, modificare ed eliminare utenti.
- Creare, visualizzare, modificare ed eliminare prodotti.
- Creare, visualizzare, modificare ed eliminare swap tra utenti.
- Accettare o rifiutare uno swap.
- Filtrare gli swap per stato, data di creazione e prodotto coinvolto.
- Caricare immagini associate ai prodotti.

Il progetto è stato realizzato seguendo i principi dell'architettura REST e utilizzando MongoDB come database.

---

## Tecnologie utilizzate

- Node.js
- Express
- MongoDB
- Mongoose
- Multer
- Express Validator
- Express Mongo Sanitize
- Dotenv
- Nodemon
- Sinon
- Node Test Runner

---

## Installazione

Clonare il repository:

```bash
git clone <repository-url>
```

Entrare nella cartella del progetto:

```bash
cd lookbook-nodejs
```

Installare le dipendenze:

```bash
npm install
```

Creare un file `.env` nella root del progetto:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lookbook
```

Avviare il server:

```bash
npm run dev
```

oppure

```bash
npm start
```

---

## Variabili d'ambiente

| Variabile | Descrizione |
|-----------|-------------|
| PORT | Porta del server |
| MONGODB_URI | Stringa di connessione MongoDB |

---

## API disponibili

### Users

| Metodo | Endpoint | Descrizione |
|----------|----------|-------------|
| GET | /api/users | Lista utenti |
| GET | /api/users/:id | Utente singolo |
| POST | /api/users | Creazione utente |
| PUT | /api/users/:id | Modifica utente |
| DELETE | /api/users/:id | Eliminazione utente |

### Products

| Metodo | Endpoint | Descrizione |
|----------|----------|-------------|
| GET | /api/products | Lista prodotti |
| GET | /api/products/:id | Prodotto singolo |
| POST | /api/products | Creazione prodotto |
| PUT | /api/products/:id | Modifica prodotto |
| DELETE | /api/products/:id | Eliminazione prodotto |

### Swaps

| Metodo | Endpoint | Descrizione |
|----------|----------|-------------|
| GET | /api/swaps | Lista swap |
| GET | /api/swaps/:id | Swap singolo |
| POST | /api/swaps | Creazione swap |
| PUT | /api/swaps/:id | Modifica swap |
| DELETE | /api/swaps/:id | Eliminazione swap |
| PATCH | /api/swaps/:id/accept | Accettazione swap |
| PATCH | /api/swaps/:id/reject | Rifiuto swap |

---

## Filtri Swap

L'endpoint:

```http
GET /api/swaps
```

supporta i seguenti parametri di query:

### Stato

```http
GET /api/swaps?status=pending
```

Valori disponibili:

- pending
- accepted
- rejected

### Data

```http
GET /api/swaps?date=2026-06-10
```

Formato richiesto:

```text
YYYY-MM-DD
```

### Prodotto

```http
GET /api/swaps?productId=<productId>
```

---

## Validazione e Sicurezza

L'applicazione implementa diversi livelli di validazione e protezione:

- Validazione delle richieste tramite Express Validator.
- Controllo degli ObjectId MongoDB.
- Middleware centralizzato per la gestione degli errori.
- Sanitizzazione degli input tramite Express Mongo Sanitize.
- Validazione delle regole di business per utenti, prodotti e swap.
- Gestione degli errori asincroni tramite wrapper dedicato.

---

## Testing

Il progetto include test automatici per controller e logica applicativa utilizzando:

- Node Test Runner
- Sinon

Per eseguire i test:

```bash
npm test
```

---

## Status Code utilizzati

| Codice | Significato |
|----------|-------------|
| 200 | Operazione completata con successo |
| 201 | Risorsa creata |
| 400 | Richiesta non valida |
| 409 | Email duplicata|
| 404 | Risorsa non trovata |
| 500 | Errore interno del server |

---

## Autore

Samuele Fiorini  
- GitHub: https://github.com/SamFio00  
- LinkedIn: https://www.linkedin.com/in/samuele-fiorini-38bba9325  
- Instagram: https://www.instagram.com/fiorini_sam_00

