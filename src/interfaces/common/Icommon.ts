import Admin from "../entityInterface/Iadmin"
import UserInterface from "../entityInterface/Iuser"
import { IUsersAndCount } from "../serviceInterfaces/IadminService"



export type AllResTypes = Admin | UserInterface | UserInterface[] | null | IUsersAndCount

export interface IApiRes<T extends AllResTypes> {
    status: number,
    message: string,
    data: T
}