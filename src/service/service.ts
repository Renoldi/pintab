import { DocumentClient } from "aws-sdk/clients/dynamodb";

import User from "../model/User";

export default class UserServerice {

    private Tablename: string = "Users";

    constructor(private docClient: DocumentClient) { }

    async getAllUsers(): Promise<User[]> {
        const users = await this.docClient.scan({
            TableName: this.Tablename,
        }).promise()
        return users.Items as User[];
    }

    async createUser(user: User): Promise<User> {
        await this.docClient.put({
            TableName: this.Tablename,
            Item: user
        }).promise()
        return user as User;
    }

    async loginUser(user: string): Promise<User[]> {
        const users = await this.docClient.query({
            TableName: this.Tablename,
            IndexName: 'name_index',
            KeyConditionExpression: '#name = :st',
            ExpressionAttributeValues: {
                ':st': user
            },
            ExpressionAttributeNames: {
                '#name': 'name',
            },
        }).promise()
        if (!users) {
            throw [];
        }
        return users.Items as User[];
    }

    // async loginUser(name: string): Promise<User> {
    //     const user = await this.docClient.get({
    //         TableName: this.Tablename,
    //         Key: {
    //             name: name
    //         }
    //     }).promise()
    //     if (!user.Item) {
    //         throw new Error("User does not exit");
    //     }
    //     return user.Item as User;

    // }
    async getUser(id: string): Promise<User> {

        const user = await this.docClient.get({
            TableName: this.Tablename,
            Key: {
                id: id
            }
        }).promise()
        if (!user.Item) {
            throw new Error("Id does not exit");
        }
        return user.Item as User;

    }

    async updateUser(id: string, user: Partial<User>): Promise<User> {
        const updated = await this.docClient
            .update({
                TableName: this.Tablename,
                Key: { id: id },
                UpdateExpression:
                    "set #name = :name,password= :password, updatedAt= :updatedAt",
                ExpressionAttributeNames: {
                    "#name": "name",
                },
                ExpressionAttributeValues: {
                    ":name": user.name,
                    ":password": user.password,
                    ":updatedAt": user.updatedAt,
                },
                ReturnValues: "ALL_NEW",
            })
            .promise();

        return updated.Attributes as User;
    }

    async deleteUser(id: string): Promise<any> {
        return await this.docClient.delete({
            TableName: this.Tablename,
            Key: {
                id: id
            }
        }).promise()

    }
}