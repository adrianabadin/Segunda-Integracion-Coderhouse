import { Request } from "express"
import { PassportService} from "./auth.pasport.service"
import * as argon from "argon2"
import { DoneCallback } from "passport"
import passport from 'passport';
import { zodCreateUserType } from "./auth.schemas";
import { CartService } from "../carts/cart.service";
const passportService = new PassportService()
const cartService= new CartService()
export class PassportController {
    constructor (
        protected passportServicedb= passportService    ){}
    async localLogin(req:Request,email:string,password:string,done:(error:any,data:any,...args:any)=>any){
try{
        const data = await passportService.findByEmail(email)
        if (data !==undefined){
            const response = data
            if (response !== null&& typeof response ==="object" && "password" in response){
                if (await argon.verify(response.password,password)){
                    return done(null,response)
                }else throw new Error ("Wrong Password")
            }else throw new Error("User not found")
        }else throw new Error("User not found!")
}catch(e){
    console.log(e)
    return done(e,null)
}
    }
    async localSignUp(req:Request<any,any,zodCreateUserType["body"]>,email:string,password:string,done:(error:any,data:any,...args:any)=>any){
        try{
            const data =await passportService.findByEmail(email)
            // si el usuario fue encontrado entonces retorna user exist error
            if (data !== null){
                console.log(data)
                    return done(new Error("User Alrready exists"),null)
            }else {
                //aqui va el codigo que crea el usuario 
                console.log(cartService)
                const cartData = await cartService.createCart()
                console.log(cartData)
                let response
                if (cartData.data !== undefined && typeof cartData.data ==="object"&& cartData.data !== null && "_id" in cartData.data) {
                 response = await passportService.createUser({...req.body,password:await argon.hash(password),cartId:cartData.data._id})
                }
                if(response !== undefined && response !==null){
                    if (typeof response === "object" && response !==null&& "_id" in response)
                    {
                        return done(null,response)
                    }else return done(new Error("Imposible crear el usuario"),null)
                }
            }
        }catch(e){
            console.log(e)
return done(e,null)

        }
    }
    async serialize(user:any,done:DoneCallback){
        console.log("serialize", user)
        done(null,user._id)
    }
    async deSerialize(userId:string,done:DoneCallback){
        const data= await passportService.findById(userId)
        console.log(data,"serialize data")
        if (data !== undefined && data !== null){
            console.log("deserialize",data)
            done (null,data)
        }else done(new Error("Error al recuperar usuario"),null)
    }
    async gitHubLogin(accesstoken:string,refreshtoken:string,profile:any,cb:DoneCallback){
        try{
 
            if (profile !== null &&typeof profile =="object" && "_json" in profile && "email" in profile._json) {
                const username = profile["_json"].email as string
                const data = await passportService.findByEmail(username.toLowerCase())
                console.log(data,username)
                if (data !== undefined && data!== null){
                    const response = data
                    if (response !== null && typeof response ==="object" && "_id" in response){
                        return cb(null,response)

                    } else{
                        throw new Error("User not found!")
                    }
                }else throw new Error("User not found!")
            }else throw new Error("User not Found!")
            

        }catch(e){
            console.log(e)
            return cb(e,null)

        }
    }
}