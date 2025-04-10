const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken'); // CommonJS syntax
const user = require("../schema/regUserSchema");
const adModel = require("../schema/adItemSchema");
require('dotenv').config()


const generateUserId = async () => {
    try {
        const lastUser = await user.findOne().sort({ userId: -1 });
        const newUserId = lastUser ? lastUser.userId + 1 : 1000;
        return newUserId

    } catch (error) {
        console.error("Error generating userId:", error);
        throw new Error("Failed to generate userId");
    }
};


exports.register = async (req, res) => {
    const usr = req.body
    const { FirstName, LastName, email, password } = usr
    console.log(usr)
    try {
        const existingUser = await user.findOne({ email: email })

        console.log("existinguser", existingUser)

        if (existingUser) {
            return res.status(406).json("Account already exist ")
        }
        const newUserId = await generateUserId();
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new user({
            userId: newUserId,
            FirstName,
            LastName,
            Address: "",
            Location: "",
            Contact: "",
            email,
            password: hashedPassword,
        })

        // Save to database
        await newUser.save()
        // res.status(200).json(newUser)
        res.status(201).json({ message: "User registered successfully", userModel: newUser })

    } catch (error) {
        res.status(401).json(error)

    }




}


exports.login = async (req, res) => {
    const usr = req.body
    const { password, email } = usr
    try {
        const existingUser = await user.findOne({ email: email })
        console.log(existingUser)

        if (!existingUser) {
            return res.status(400).json("user not found")

        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign({ email: existingUser.email }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({ userDetails: existingUser, token })


    } catch (error) {
        return res.status(500).json({ error: error.message })

    }






}
exports.getUser = async (req, res) => {
    try {

        const userId = Number(req.params.userId); // Ensure it's a number
        console.log("userId", userId)

        const existingUser = await user.findOne({ userId });

        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }
        else if (existingUser) {
            return res.status(200).json({ message: "success", data: existingUser })

        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


exports.editUser = async (req, res) => {
    try {

        const userId = Number(req.params.userId);
        console.log("Updating user with ID:", userId, "Request Body:", req.body);

        const imageUrl = `/upload/${req.file.filename}`;
        const existingUser = await user.findOne({ userId });

        if (!existingUser) {
            console.error("User not found:", userId);
            return res.status(404).json({ message: "User not found" });
        }

        const updateData = {
            Image:imageUrl?imageUrl:"",
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Address: req.body.Address,
            Location: req.body.Location,
            Contact: req.body.Contact,
        };

        const updatedUser = await user.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            console.error("Database update failed for user:", userId);
            return res.status(500).json({ message: "Error updating profile" });
        }

        console.log("Updated User:", updatedUser);
        return res.status(200).json({ message: "Profile updated successfully!", data: updatedUser });

    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: error.message });
    }
}


exports.addAds = async (req, res) => {
    try {
        const userId = Number(req.params.UserId);
    console.log("one",req)
    console.log("ads",req.body)
    console.log("userid",UserId)
        const {
            brand,
            year,
            fuel,
            transmission,
            kmDriven,
            owners,
            title,
            description,
            price,
            category,
            subcategory,
            UserId,
        } = req.body;
        console.log( brand,
            year,
            fuel,
            transmission,
            kmDriven,
            owners,
            title,
            description,
            price)

            const imageUrls = req.files?.map(file => `/upload/${file.filename}`) || [];
        
        const newAd = new adModel({
            UserId,
            category,
            subcategory,
            brand,
            year,
            fuel,
            transmission,
            kmDriven,
            owners,
            title,
            description,
            price,
            image: imageUrls.length > 0 ? imageUrls : [],

           
        })

        await newAd.save();

        res.status(201).json({ message: 'Ad created successfully', ad: newAd });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};














