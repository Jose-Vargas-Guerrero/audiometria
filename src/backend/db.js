import sql from 'mssql';

//configuracion de conexion
const dbConfig = {
    user: 'usersql4',
    password: '123456',
    server: 'localhost',
    database: 'centoOtaudiologicoSur',
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