import User from "../models/user.model.js";

export default async function verified(req,res){
    try {
        const { token } = req.params;
        const user = await User.findOne({ verifiedToken: token });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        user.verified = true;
        user.verifiedToken = undefined;
        await user.save();
        res.status(200).json({
            success: true,
            message: "User verified successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to verify user",
            error: error.message,
        });
    }
}