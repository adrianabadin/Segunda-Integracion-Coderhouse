export abstract class AuthError extends Error{
    constructor(public errorContent?:any, public message:string="Error de autenticacion",public code:number=0){
        super(message)
        this.name="AuthError"
    }
}

export class UserDontExist extends AuthError{
    public text:string
    constructor(public errorContent?:any, public message:string="El usuario no existe",public code:number=401){
        super(errorContent,message,code)
        this.text=message
        this.name="User dont exists"
    }
}