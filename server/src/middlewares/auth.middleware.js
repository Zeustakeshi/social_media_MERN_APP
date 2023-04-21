import jwt from "jsonwebtoken";
import refeshTokenModel from "../models/refeshToken.model.js";

export const authenticationMiddleware = (req, res, next) => {
    const { access_token: token, refresh_token } = req.cookies;
    if (!token) return res.status(401).json("Unauthorized !");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json("TokenExpiredError !");
            } else return res.status(403).json("Invalid token!");
        }

        req.user = { userID: data._id };
        next();
    });
};

export const socketAuthMiddleware = (socket, next) => {
    let token = socket.handshake?.headers?.cookie?.split(" ")[0]?.split("=")[1];
    token = token?.slice(0, token.length - 1);

    if (!token) return next(new Error("Unauthorized !"));

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) return next(new Error("Invalid token!"));
        return next();
    });
};
