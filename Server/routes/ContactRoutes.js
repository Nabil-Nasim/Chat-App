import {
    searchContact
} from "../controllers/ContactsController.js";
import {
    verifyToken
} from "../middlewares/AuthMiddleware.js";
import {
    Router
} from "express";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContact)

export default contactsRoutes