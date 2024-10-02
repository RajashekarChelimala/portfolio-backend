import express from "express";
import {
  handleNewService,
  getAllServices,
  getService,
  deleteService,
  updateService,
  getAllActiveServices,
} from "../controllers/serviceController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();

router.route("/").get(getAllServices);
router.route("/activeServices").get(getAllActiveServices);
router.route("/:id").get(getService);

router.use(verifyJWT);
router.route("/").post(handleNewService).put(updateService);

router.route("/:id").delete(deleteService);

export default router;
