import { Strategy,ExtractJwt } from "passport-jwt";
import passport from "passport";
import { Request } from "express";
import { PassportController } from "./auth.passport.controller";
const passportController= new PassportController()
function cookieExtractor(req:Request):string{

    console.log("texo")
    if ("jwt" in req.cookies && typeof req.cookies.jwt === "string"){
        return req.cookies.jwt
}else throw new Error("Invalid cookie")
}
passport.use('jwt',new Strategy({passReqToCallback:true,jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor]),secretOrKey:"Tokenize your life"},passportController.jwtLoginVerify))