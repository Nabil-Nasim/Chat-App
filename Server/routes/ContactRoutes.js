import {searchContact , getContactsForDMList,getAllContacts} from "../controllers/ContactsController.js";
import {verifyToken} from "../middlewares/AuthMiddleware.js";
import {Router} from "express";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContact)
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList)
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts)

export default contactsRoutes