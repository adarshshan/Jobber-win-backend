import IPostInterface from "../entityInterface/Ipost";
import { LikeInterface } from "../../models/likeModel";

export interface IPostRepository {
    savePost(userId: string, imageUrl: string, caption: string): Promise<IPostInterface>;
    getPosts(userId: string): Promise<IPostInterface[]>;
    getPostForHome(): Promise<any[]>; // Complex return type due to aggregation
    likePost(postId: string, userId: string): Promise<{ success: boolean; data?: LikeInterface; message: string }>;
    unLikePost(postId: string, userId: string): Promise<{ success: boolean; data?: LikeInterface; message: string }>;
    getLikes(postId: string): Promise<any>;
    deletePost(postId: string): Promise<IPostInterface>;
    updateCaption(caption: string, postId: string): Promise<IPostInterface>;
    getSinglePostDetails(postId: string): Promise<IPostInterface>;
    changePostReportStatus(postId: string): Promise<IPostInterface>;
}