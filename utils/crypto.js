const crypto = require("crypto");

const SECRET_KEY = process.env.SECRET_KEY;
const KEY = crypto.createHash("sha256").update(SECRET_KEY).digest();


function encrypt(text){
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;;
}

function decrypt(encryptedText){
    const parts = encryptedText.split(":");
    const ivHex = parts[0];
    const encryptedData = parts[1];
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

module.exports = {encrypt, decrypt};