import express from 'express'
import cors from 'cors'
import {errorMiddleware} from './middlewares/error.js'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cardRoutes from './routes/cardRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js'
import { AppDataSource } from './config/database.js'


  dotenv.config({path: './.env',});

  export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
  const port = process.env.PORT || 3000;


  const app = express();


 app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin:' * ',credentials:true}));
app.use(morgan('dev')) 


  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  app.get('/ping', (req, res) => res.send('Pong!'));

  app.use('/cards', cardRoutes);
  
  app.use(errorHandler);

  // your routes here

  
  app.get("*", (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Page not found'
    });
  });

  app.use(errorMiddleware);
  
  AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!")
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((err) => {
    console.error("Error during Data Source initialization:", err)
})
  // app.listen(port, () => console.log('Server is working on Port:'+port+' in '+envMode+' Mode.'));
  // export default app;