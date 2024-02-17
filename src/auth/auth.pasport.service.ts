import { ResponseObject } from "../entities/classes";
import {TypegooseDAO}  from "../services/typegoose.dao"
import { UserTS, zodCreateUserType, zodUserType } from './auth.schemas';
const dbServiceObject = new TypegooseDAO<Omit<zodCreateUserType["body"],"password2">>(UserTS,"UserTG")
export class PassportAuthService {
    constructor(private dbService=dbServiceObject  ){}
    async findByUserName (username:string){
        try{
            const data= await this.dbService.model.findOne({email:username})
            if (data !== null){
                return new ResponseObject(null,true,data.toObject()) 
            }else  throw new Error("Username not found")
            
        }catch(e){
            console.log(e)
            return new ResponseObject(e,false,null)
        }
    }
    async createUser(dataParsed:zodCreateUserType["body"]){
        try {
           const data = await this.dbService.model.create({dataParsed,password2:undefined})
           if (data !== null){
            return new ResponseObject(null,true,data.toObject())
           }else throw new Error("Could not create user")
        }catch(e){
            console.log(e)
            return new ResponseObject(e,false,null)
        }
    }
    async findUserById (id:string){
        try {
            const data =await this.dbService.getProductById(id)
            if (data !== null && typeof data === 'object' ){
                return new ResponseObject(null,true,data.toObject())
            }else throw new Error("User Id not found")

        }catch(e){console.log(e)
        return new ResponseObject(e,false,null)
        }
    }
}