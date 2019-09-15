import Server from './server/server';
import Database from './database/database';
import IndexersRoutes from './routes/indexers'

const server:Server = Server.init();
const app = server.App;
Database.getInstance();

app.use(IndexersRoutes);

server.listen((port:number) => {
    console.log(`Listening port ${ port }`);
});