  
import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';

import ProductsController from './controllers/ProductsController';
import CategoriesController from './controllers/CategoriesController'

const routes = Router();
const upload = multer(uploadConfig)

routes.get('/products', ProductsController.index);
routes.get('/products/id/', ProductsController.show);

routes.get('/categories', CategoriesController.index);
routes.get('/categories/:id', CategoriesController.show);

routes.post('/admin/products', upload.array('images'), ProductsController.create);
routes.post('/admin/categories', upload.array('images'), CategoriesController.create);

export default routes;