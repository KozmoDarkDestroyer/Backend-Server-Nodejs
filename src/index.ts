import Server from './server/server';
import Database from './database/database';
import IndexersRoutes from './routes/indexers'

const server:Server = Server.init();
const app = server.App;
Database.getInstance();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),
    res.header("Access-Control-Allow-Methods","POST,PUT,GET,DELETE,OPTIONS"),
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept,token');
    next();
});

app.use(IndexersRoutes);

server.listen((port:number) => {
    console.log(`Listening port ${ port }`);
});