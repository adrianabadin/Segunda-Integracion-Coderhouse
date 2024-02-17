import { NextFunction, Request, Response } from "express";
import { AuthService } from "./no sirve";
import { zodCreateUserType, zodUserType } from './auth.schemas';
export class AuthController{
    constructor(){}
   
    async getLogin (_req:Request,res:Response){
        res.render("login")
            }
    getGhLogin(_req:Request,res:Response){
        res.render("login")
    }        
    getRegister (_req:Request,res:Response){res.render("register")}
    getProfile (req:Request,res:Response) {
        res.render("profile",{user:req.user})
    }
    validateRol (admitedRoles:zodCreateUserType["body"]["role"]){return (req:Request,res:Response,next:NextFunction)=>{
    console.log("dentro de validateRol",req.user)
        if (req.user !== undefined && "role" in req.user){
        if (admitedRoles === req.user.role)  next()
        else res.send("Unauthorized")
    }else res.render("login")
    }}
    logout(req:Request,res:Response){
        req.session.destroy((error)=>res.send({message:"Unable to destroy session",error}))

    }
}
