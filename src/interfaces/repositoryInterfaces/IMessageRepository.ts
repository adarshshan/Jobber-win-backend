
export interface IMessageRepository {
    sendMessage(sender: string, content: string, chatId: string): Promise<any>;
    allMessages(chatId: string): Promise<any[]>;
}