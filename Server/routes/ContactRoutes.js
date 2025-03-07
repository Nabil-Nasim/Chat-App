import {
    searchContact , getContactsForDMList
} from "../controllers/ContactsController.js";
import {
    verifyToken
} from "../middlewares/AuthMiddleware.js";
import {
    Router
} from "express";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContact)
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList)


export default contactsRoutes