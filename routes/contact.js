import express from "express";
import {handleNewContact,getAllContact} from "../controllers/contactController.js";

const router = express.Router();

router.route('/')
    .post(handleNewContact)
    .get(getAllContact)

export default router;