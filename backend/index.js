const express = require('express')
const cors = require('cors')
const mysql2 = require('mysql2');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

//connexion a mysql 
const bd = mysql2.createConnection({
    host: 'localhost',
    password: '',
    user: 'root',
    database: 'bikeuniver'
})

bd.connect((error) => {
    if (error) throw error;
    console.log('connecter a la base mysql');
});

app.post('/api/signin', (req, res) => {
    const { nom, email, password } = req.body;
    const sql = 'INSERT INTO form (nom, email, password) VALUES (?, ?, ?)';
    bd.query(sql, [nom, email, password], (error, result) => {
        if (error) {
            console.error('erreur l\'ors de l\'insertion dans la bd:', error);
            res.status(500).json({ message: 'erreur serveur' });
        } else {
            console.log('donnes inserer avec success');
            res.json({ success: true, message: 'Inscription réussie' });
        }
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM form WHERE email= ? AND password= ?';
    bd.query(sql, [email, password], (error, result) => {
        if (error) {
            console.error('erreur l\'ors de la connexion:', error);
            res.status(500).json({ sucess: false, message: 'erreur de serveur' })
        }
        if (result.length > 0) {
            return res.json({ success: true, message: 'connexion reussis', user: result[0]})
        }else{
            return res.status(401).json({success:false, message:'email ou mot de passe incorect'})
        }
    })
})
app.get('/api/user', (req, res) => {
    const sql = 'SELECT * FROM form';
    bd.query(sql, (error, result) => {
        if (error) {
            console.error('Erreur lors de la récupération :', error);
            return res.status(500).send('Erreur serveur');
        }
        res.status(200).json(result);
    })
})

app.listen(port, () => {
    console.log('serveur lancer sur http://localhost:', port);
});