const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken'); // CommonJS syntax
const user = require("../schema/regUserSchema");
const adModels = require("../schema/addSchemas");
const { Resend } = require("resend")
const crypto = require("crypto");
const { log } = require("console");


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
    //  console.log(usr)
    try {
        const existingUser = await user.findOne({ email: email })

        //  console.log("existinguser", existingUser)

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
        // console.log(existingUser)

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
        // console.log("userId", userId)

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
        //console.log("Updating user with ID:", userId, "Request Body:", req.body);
        const imageUrl = req.file ? `/profileImages/${req.file.filename}` : null;

        // const imageUrl = `/profileImages/${req.file.filename}`;
        const existingUser = await user.findOne({ userId });

        if (!existingUser) {
            console.error("User not found:", userId);
            return res.status(404).json({ message: "User not found" });
        }

        const updateData = {
            ...(req?.file?.filename ? { Image: imageUrl } : {}),
            // ...(req?.file?.filename ? { img: imageUrl } : {}),
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

        //console.log("Updated User:", updatedUser);
        return res.status(200).json({ message: "Profile updated successfully!", data: updatedUser });

    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: error.message });
    }
}
const generateProductId = async () => {
    try {
        const lastAd = await adModels.findOne().sort({ adId: -1 });
        const  newProductId = lastAd ? lastAd.adId + 1 : 10000;
        return newProductId;
    } catch (error) {
        console.error("Error generating ProductId:", error);
        throw new Error("Failed to generate ProductId");
    }
};



exports.addAds = async (req, res) => {
    try {
        // console.log("files", req.files);
        //console.log("ads", req.body);

        const {
            brand,
            year,
            fuel,
            transmission,
            kmDriven,
            owners,
            title,
            description,
            location,
            price,
            category,
            subcategory,
            userId,
        } = req.body;

        const imageUrls = req.files?.map(file => `/profileImages/${file.filename}`) || [];

        const adId = await  generateProductId();
        // console.log(adId)

        const newAd = new adModels({
            adId, // 🌟 store it in the DB
            userId,
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
            location,
            price,
            image: imageUrls.length > 0 ? imageUrls : [],
        });

        await newAd.save();

        res.status(201).json({ message: 'Ad created successfully', ad: newAd });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllAds = async (req, res) => {
    // console.log("inside get all ads")
    try {
        const adds = await adModels.find();

        res.status(200).json(adds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.getUserAds = async (req, res) => {
    try {

        const userId = Number(req.params.userId); // Ensure it's a number
        // console.log("userId", userId)

        const existingAds = await adModels.find({ userId });
        // console.log("existing Ads", existingAds)
        if (!existingAds) {
            return res.status(400).json({ message: "Ads not found" });
        }
        else if (existingAds) {
            return res.status(200).json({ message: "success", data: existingAds })

        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}



exports.getAdById = async (req, res) => {
    // console.log("inside get ad by id");
    try {
        // Get the id from request parameters
        const { adId } = req.params;
        // console.log(`Fetching ad with ID: ${adId}`)

        // Find the ad with the matching id
        const ad = await adModels.findOne({ adId: adId });
        // console.log(ad)

        // If no ad is found with that id
        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }

        // Return the ad if found
        res.status(200).json(ad);
    } catch (err) {
        // Handle errors (including invalid ID format)
        console.error("Error fetching ad by ID:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.updateAd = async (req, res) => {
    try {
        const { adId } = req.params; // Extract adId from params
        // console.log(adId);

        const updateData = { ...req.body };

        if (req.files) {
            const imagePaths = req.files.map(file => `/profileImages/${file.filename}`);
            updateData.image = imagePaths;
        }

        const updatedAd = await adModels.findOneAndUpdate({ adId: adId }, updateData, { new: true });

        if (!updatedAd) {
            return res.status(404).json({ error: 'Ad not found' });
        }

        res.status(200).json(updatedAd);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update ad' });
    }
}
exports.searchItem = async (req, res) => {
    //  console.log(req)
    try {
        const query = req.params.query;

        console.log(query)
        if (!query) return res.json({ items: [] });

        const items = await adModels.find({
            $or: [
                { subcategory: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { title: { $regex: query, $options: 'i' } },
            ],
        });

        res.json({ items });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed !!!!' });
    }
}
exports.searchLocation = async (req, res) => {
    //  console.log(req)
    try {
        const query = req.params.query;

        console.log(query)
        if (!query) return res.json({ items: [] });

        const items = await adModels.find({
            $or: [
                { location: { $regex: query, $options: 'i' } },
            ]
        });

        res.json({ items });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed !!!!' });
    }
}


exports.deleteAd = async (req, res) => {
    try {
        const { adId } = req.params;

        const deletedAd = await adModels.findOneAndDelete({ adId });

        if (!deletedAd) {
            return res.status(404).json({ message: "Ad not found" });
        }

        res.status(200).json({ message: "Ad deleted successfully", data: deletedAd });
    } catch (error) {
        console.error("Error deleting ad:", error);
        res.status(500).json({ error: "Failed to delete ad" });
    }
};

exports.forgotPswd = async (req, res) => {
    try {
        const { email } = req.body
        console.log(email)
        const users = await user.findOne({ email })
        console.log(users)
        if (!user) return res.status(200).send("if the user exist,emailwill be send")
        const token = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        users.resetPasswordToken = hashedToken;
        users.resetPasswordExpires = Date.now() + 360000;
        await users.save()
        const resetLink = `http://localhost:5173/resetPassword/${token}`
        const resend = new Resend('re_fFuNFZVf_2xrSAEyn5E7YLCgUxZEeg7P6')
        try {
            const { data, error } = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Reset Password',
                html: `<p>This is the link to reset Your Password<strong>Link:</strong>${resetLink}</p>`
            });
            console.log("data", data)
            console.log("error", error)
        } catch (error) {
            console.error(error); // Good to log the actual error
            res.status(500).json({ error: 'Failed to send email !!' });
        }

    } catch (error) {
        console.error(error); // Good to log the actual error
        res.status(500).json({ error: 'Failed to update ad' });
    }
    res.send('password resetLink send')
}
exports.resetPassword = async (req, res) => {
    const { token } = req.params; // Token from URL
    const { password } = req.body; // New password from the request body

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const users = await user.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Check if token is expired
        });
        console.log(user)
        console.log(users)
        if (!users) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and remove reset token
        users.password = hashedPassword;
        users.resetPasswordToken = undefined;
        users.resetPasswordExpires = undefined;
        await users.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}
exports.getUserFavorites = async (req, res) => {
    try {
        // console.log("userid1", req)
        const userId = Number(req.params.userId);

        console.log("userid", userId)

        const existingUser = await user.findOne({ userId })

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // console.log("result", existingUser.favorites);
        // console.log(typeof (existingUser.favorites));

        const favoriteAdIds = existingUser.favorites.map(Number);

        const favoriteAds = await adModels.find({
            adId: { $in: favoriteAdIds }
        });




        console.log("ADS", favoriteAds);
        res.status(200).json({ favorites: favoriteAds });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.addToFavorites = async (req, res) => {
    try {
        const userId = req.body.userId;
        const adId = Number(req.body.adId);
        console.log("userid", userId, "addid", adId)

        const existingUser = await user.findOne({ userId: userId });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (existingUser.favorites.includes(adId)) {
            return res.status(400).json({ message: 'Product already in favorites' });
        }

        const updatedUser = await user.findOneAndUpdate(
            { userId: userId },
            { $addToSet: { favorites: adId } },
            { new: true }
        );

        res.status(200).json({
            message: 'Product added to favorites',
            favorites: updatedUser.favorites
        });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.removeFromFavorites = async (req, res) => {
    try {
        const userId = req.body.userId;
        const adId = Number(req.body.adId);
        console.log("userid", userId, "addid", adId)

        const existingUser = await user.findOne({ userId: userId });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        existingUser.favorites = existingUser.favorites.filter(
            (id)=>id !== adId
        );
        await existingUser.save();

        res.status(200).json({ message: 'Product removed from favorites' });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

















