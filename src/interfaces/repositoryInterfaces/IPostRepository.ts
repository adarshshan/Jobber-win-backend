import { Document } from "mongoose";
import IPostInterface from "../entityInterface/Ipost";
import { LikeInterface } from "../../models/likeModel";

export interface IPostRepository {
    savePost(userId: string, imageUrl: string, caption: string): Promise<IPostInterface | null>;
    getPosts(userId: string): Promise<(IPostInterface & Document)[] | undefined | null>;
    getPostForHome(): Promise<any[] | undefined>; // Complex return type due to aggregation
    likePost(postId: string, userId: string): Promise<{ success: boolean; data?: (LikeInterface & Document); message: string } | undefined>;
    unLikePost(postId: string, userId: string): Promise<{ success: boolean; data?: (LikeInterface & Document); message: string } | undefined>;
    getLikes(postId: string): Promise<(LikeInterface & Document) | undefined | null>;
    deletePost(postId: string): Promise<(IPostInterface & Document) | undefined>;
    updateCaption(caption: string, postId: string): Promise<(IPostInterface & Document) | undefined>;
    getSinglePostDetails(postId: string): Promise<(IPostInterface & Document) | undefined | null>;
    changePostReportStatus(postId: string): Promise<(IPostInterface & Document) | undefined>;
}