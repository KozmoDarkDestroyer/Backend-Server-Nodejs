import Server from '../server/server';
import User from './user';
import Upload from './upload';
import Login from './login';
import Search from './search';

const server:Server = Server.init();
const app = server.App;

// ===========================================
// Routes
// ===========================================

app.use(User);
app.use(Upload);
app.use(Login);
app.use(Search);

export default app;