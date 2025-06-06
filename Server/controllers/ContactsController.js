import User from "../models/UserModel.js"
import mongoose from "mongoose"
import Message from "../models/MessagesModel.js"
export const searchContact = async (req, res, next) => {
    try {
        const {
            searchTerm
        } = req.body
        if (searchTerm === undefined || searchTerm === null) {
            return res.status(400).send("searchTerm is required")
        }
        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        )
        const regex = new RegExp(sanitizedSearchTerm, "i")
        const contacts = await User.find({
            $and: [{
                _id: {
                    $ne: req.userId
                }
            }, {
                $or: [{
                    firstName: regex
                }, {
                    lastName: regex
                }, {
                    email: regex
                }]
            }]
        })
        return res.status(200).json({
            contacts
        })

      

    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
}

export const getContactsForDMList = async (req, res, next) => {
    try {
        let {userId} = req;
        userId= new mongoose.Types.ObjectId(userId)

        const contacts = await Message.aggregate([{
            // It filters messages where the userId is either the sender or receiver.
            // This ensures we get all messages involving the user.
            $match:{
                $or:[{sender:userId},{receiver:userId}],
            },

        },
        {
            $sort:{
                timestamp:-1
            },
        },
        // Groups messages based on the other user in the conversation.
        // _id:
        // If the userId is the sender, it stores recipient as the contact.
        // If the userId is the receiver, it stores sender as the contact.

        {
            $group:{
                _id:{
                    $cond:{
                        if:{
                            $eq:["$sender",userId]
                        },
                        then:"$recipient",
                        else:"$sender",
                        },
                    },
                    lastMessageTime:{
                        $first:"$timestamp"
                    },
                },
            },
            // Joins the Users collection to get additional user details (email, firstName, etc.).
            // Matches _id from the previous stage with _id in the Users collection.
            {
                $lookup:{
                    from:"users",
                    localField:"_id",
                    foreignField:"_id",
                    as:"contactInfo",
                },
            },
            // Since lookup returns an array, $unwind extracts the first document.
            {
                $unwind:"$contactInfo",
            },
          {
            $project:{
                _id:1,
                lastMessageTime:1,
                email:"$contactInfo.email",
                firstName:"$contactInfo.firstName",
                lastName:"$contactInfo.lastName",
                image:"$contactInfo.image",
                color:"$contactInfo.color",
            },
          },
          {
            $sort:{
                lastMessageTime:-1
            },
          }
    ])

        return res.status(200).json({contacts})

       

    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
}

export const getAllContacts = async (req, res, next) => {
    try {
        //get all users except the current user
        const user = await User.find({
            _id: {
                $ne: req.userId
            }
        },"firstName lastName _id email ")

        const contacts = user.map((user) => ({
           label: user.firstName? `${user.firstName} ${user.lastName}` : user.email,
           value: user._id
        }))
        return res.status(200).json({contacts})

      
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server Error")
    }
}