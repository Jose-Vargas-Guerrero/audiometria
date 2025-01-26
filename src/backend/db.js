import sql from 'mssql';

//configuracion de conexion
const dbConfig = {
    user: 'usersql4',
    password: '12345',
    server: 'localhost',
    database: 'centroOtaudiologicoSur',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    }
}


const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then( pool => {
        console.log('conectado a sql server');
        return pool
    })
    .catch(err => {
        console.log('error en la conexion sql server',err)
        throw err
    })

    export {sql,poolPromise}