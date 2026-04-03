const Link = require("../models/Link");
const {encrypt, decrypt} = require("../utils/crypto");

const createLink = async (req, res)=> {
    try{
        const {short, longUrl, userName, passWord} = req.body;
        if(!short || !longUrl || !userName || !passWord){
            res.status(400).json({
                success: false,
                message: "Sth wrong when create"
            });
        }
        const existingLink = await Link.findOne({short});
        if(existingLink){
            return res.status(400).json({
                success: false,
                message: "Short key already exist",
            });
        }
        const encryptedUsername = encrypt(userName);
        const encryptedPassword = encrypt(passWord);
        const newLink = new Link({
            short,
            longUrl,
            userName: encryptedUsername,
            passWord: encryptedPassword,
        })
        await newLink.save();
        res.status(201).json({
            status: true,
            message: "Link created successfully",
            data: {
                short: newLink.short,
                longUrl: newLink.longUrl,
                userName: newLink.userName,
                passWord: newLink.passWord,
            }
        })
    }
    catch(error){
        console.log("Error creating link", error);
        res.status(500).json({
            success: "failed",
            message: "server error",
        });
    }
}
const getAllLinks = async(req, res)=>{
    try{
        const links = await Link.find();

        return res.status(200).json({
            success: true,
            count: links.length,
            data: links.map((link)=>({
                _id: link._id,
                short: link.short,
                longUrl: link.longUrl,
                userName: "encrypted",
                passWord: "encrypted",
                createdAt: link.createdAt,
                updatedAt: link.updatedAt,
            }))
        });
    }catch(error){
        console.log("Error getting all links: ", error);
        return res.status(500).json({
            success: "fail",
            message: "Server error",
        });
    }
}

const getLinkByShort = async(req, res)=>{
    try{
        const {short} = req.params;
        const link = await Link.findOne({short});
        console.log("link found:", link);
        console.log("link.userName:", link.userName);
        console.log("link.passWord:", link.passWord);
        if(!link){
            return res.status(404).json({
                success: false,
                message: "Link not found",
            })
        }
        const decryptedUserName = decrypt(link.userName);
        const decryptedPassWord = decrypt(link.passWord);
        return res.status(200).json({
            success: true,
            data: {
                short: link.short,
                longUrl: link.longUrl,
                userName: decryptedUserName,
                passWord: decryptedPassWord,
            }
        })
    }
    catch(error){
        console.error("Error getting link by short: ", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const redirectToLongUrl = async(req, res)=>{
    try{
        const {short} = req.params;
        const link = await Link.findOne({short});
        if(!link){
            return res.status(404).send("Short Url not found");
        }
        return res.redirect(link.longUrl);

    }catch(error){
        console.error("Error redirecting", error);
        return res.status(500).send("Server error");
    }
}


module.exports = {
  createLink,
  getAllLinks,
  getLinkByShort,
  redirectToLongUrl
};