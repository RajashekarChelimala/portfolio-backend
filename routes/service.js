import express from "express";
import {handleNewService,getAllServices,getService,deleteService,updateService, getAllActiveServices} from "../controllers/serviceController.js";

const router = express.Router();

router.route('/')
    .post(handleNewService)
    .get(getAllServices)
    .put(updateService);

router.route('/activeServices')
    .get(getAllActiveServices)

router.route('/:id')
    .get(getService)
    .delete(deleteService);

export default router;