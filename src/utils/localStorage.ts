export function getToken():String|null{
    const token = localStorage.getItem("token");
    return token ? JSON.parse(token):null
}


export function saveToken(token:string):void{

    localStorage.setItem("token",JSON.stringify(token));
}


export function saveUser(user:){
    localStorage.setItem("user",JSON.stringify(User))
}
