import { Request, Response } from 'express';
import PostServices from './../service/postService';
import { NotFoundError, DatabaseError } from '../utils/errors';


class PostController {
    constructor(private postServices: PostServices) { }

    async savePost(req: Request, res: Response) {
        try {
            const { userId, imageUrl, caption } = req.body;
            const result = await this.postServices.savePost(userId, imageUrl, caption);
            res.json({ success: true, data: result, message: 'Post successfully added.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in savePost controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while saving post.' });
            } else if (error instanceof Error) {
                console.error("Error in savePost controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while saving post.' });
            } else {
                console.error("Unexpected error in savePost controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while saving post.' });
            }
        }
    }
    async getPosts(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const result = await this.postServices.getPosts(userId);
            res.json({ success: true, data: result, message: 'Posts fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getPosts controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching posts.' });
            } else if (error instanceof Error) {
                console.error("Error in getPosts controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching posts.' });
            } else {
                console.error("Unexpected error in getPosts controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching posts.' });
            }
        }
    }
    async getPostForHome(req: Request, res: Response) {
        try {
            const result = await this.postServices.getPostForHome();
            res.json({ success: true, data: result, message: 'Posts for home feed fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getPostForHome controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching posts for home feed.' });
            } else if (error instanceof Error) {
                console.error("Error in getPostForHome controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching posts for home feed.' });
            } else {
                console.error("Unexpected error in getPostForHome controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching posts for home feed.' });
            }
        }
    }
    async likePost(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.postServices.likePost(postId, userId);
            res.json(result);
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in likePost controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while liking post.' });
            } else if (error instanceof Error) {
                console.error("Error in likePost controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while liking post.' });
            } else {
                console.error("Unexpected error in likePost controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while liking post.' });
            }
        }
    }
    async unLikePost(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.postServices.unLikePost(postId, userId);
            res.json(result);
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in unLikePost controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while unliking post.' });
            } else if (error instanceof Error) {
                console.error("Error in unLikePost controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while unliking post.' });
            } else {
                console.error("Unexpected error in unLikePost controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while unliking post.' });
            }
        }
    }
    async getLikes(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const result = await this.postServices.getLikes(postId);
            res.json({ success: true, data: result, message: 'Likes fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getLikes controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching likes.' });
            } else if (error instanceof Error) {
                console.error("Error in getLikes controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching likes.' });
            } else {
                console.error("Unexpected error in getLikes controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching likes.' });
            }
        }
    }
    async sendComment(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const userId = req.userId;
            const { comment } = req.body
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.postServices.sendComment(postId, userId, comment);
            res.json({ success: true, data: result, message: 'Comment sent successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in sendComment controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while sending comment.' });
            } else if (error instanceof Error) {
                console.error("Error in sendComment controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while sending comment.' });
            } else {
                console.error("Unexpected error in sendComment controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while sending comment.' });
            }
        }
    }
    async getComment(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const result = await this.postServices.getComment(postId);
            res.json({ success: true, data: result, message: 'Comments fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in getComment controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching comments.' });
            } else if (error instanceof Error) {
                console.error("Error in getComment controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching comments.' });
            } else {
                console.error("Unexpected error in getComment controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching comments.' });
            }
        }
    }
    async replyComment(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { reply } = req.body;
            const { commentId } = req.params;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.postServices.replyComment(reply, commentId, userId);
            res.json({ success: true, data: result, message: 'Reply added successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in replyComment controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while replying to comment.' });
            } else if (error instanceof Error) {
                console.error("Error in replyComment controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while replying to comment.' });
            } else {
                console.error("Unexpected error in replyComment controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while replying to comment.' });
            }
        }
    }
    async deletePost(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const result = await this.postServices.deletePost(postId);
            res.json({ success: true, data: result, message: 'Post deleted successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ success: false, message: 'Post not found for deletion.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in deletePost controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while deleting post.' });
            } else if (error instanceof Error) {
                console.error("Error in deletePost controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while deleting post.' });
            } else {
                console.error("Unexpected error in deletePost controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while deleting post.' });
            }
        }
    }
    async updateCaption(req: Request, res: Response) {
        try {
            const caption = req.body.caption;
            const postId = req.params.postId;
            const result = await this.postServices.updateCaption(caption, postId);
            res.json({ success: true, data: result, message: 'Caption updated successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ success: false, message: 'Post not found for updating caption.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in updateCaption controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while updating caption.' });
            } else if (error instanceof Error) {
                console.error("Error in updateCaption controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while updating caption.' });
            } else {
                console.error("Unexpected error in updateCaption controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while updating caption.' });
            }
        }
    }
    async postShareSuggestedUsers(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication Error: User ID not found.' });
            }
            const result = await this.postServices.postShareSuggestedUsers(userId);
            res.json({ success: true, data: result, message: 'Suggested users fetched successfully.' });
        } catch (error) {
            if (error instanceof DatabaseError) {
                console.error("Database error in postShareSuggestedUsers controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching suggested users.' });
            } else if (error instanceof Error) {
                console.error("Error in postShareSuggestedUsers controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching suggested users.' });
            } else {
                console.error("Unexpected error in postShareSuggestedUsers controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching suggested users.' });
            }
        }
    }
    async getSinglePostDetails(req: Request, res: Response) {
        try {
            const postId = req.params.postId;
            const post = await this.postServices.getSinglePostDetails(postId);
            const comment = await this.postServices.getCommentsByPostId(postId);
            const like = await this.postServices.getLikes(postId);
            res.json({ success: true, data: { post, comment, like }, message: 'Post details fetched successfully.' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ success: false, message: 'Post not found.' });
            } else if (error instanceof DatabaseError) {
                console.error("Database error in getSinglePostDetails controller:", error);
                res.status(500).json({ success: false, message: 'Internal server error while fetching post details.' });
            } else if (error instanceof Error) {
                console.error("Error in getSinglePostDetails controller:", error);
                res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred while fetching post details.' });
            } else {
                console.error("Unexpected error in getSinglePostDetails controller:", error);
                res.status(500).json({ success: false, message: 'An unexpected error occurred while fetching post details.' });
            }
        }
    }

}

export default PostController;