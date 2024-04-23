import mongoose, { ObjectId } from "mongoose";


interface IPostInterface {
    userId?: ObjectId;
    caption: string;
    imageUrl: string;
    isPrivate: boolean;
}

export default IPostInterface;