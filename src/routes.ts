  
import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';

import ProductsController from './controllers/ProductsController';

const routes = Router();
const upload = multer(uploadConfig)

routes.get('/products', ProductsController.index);
routes.get('/products/:id', ProductsController.show);

routes.post('/admin/products', upload.array('images'), ProductsController.create);

export default routes;