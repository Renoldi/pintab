import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import usersService from '../../service'

import { v4 } from "uuid";
import { hashPass, verify } from "../../service/bcryptjs"

export const getAllUsers = middyfy(async (): Promise<APIGatewayProxyResult> => {
    const users = await usersService.getAllUsers();
    return formatJSONResponse({
        users
    })
})

export const createUser = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = v4();
        const passwordh = await hashPass(event.body.password)
        const user = await usersService.createUser({
            id: id,
            name: event.body.name,
            password: passwordh,
            createdAt: new Date().toISOString(),
        })
        return formatJSONResponse({
            user
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})

export const getUser = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
        const user = await usersService.getUser(id)
        return formatJSONResponse({
            user, id
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})

export const updateUser = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
        const user = await usersService.updateUser(id, {
            name: event.body.name,
            password: event.body.password,
            updatedAt: new Date().toISOString(),
        })
        return formatJSONResponse({
            user, id
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})

export const loginUser = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
        const user = await usersService.loginUser(
            event.body.name
        )

        if (!verify(event.body.password, user.password)) {
            return formatJSONResponse({
                status: 500,
                message: "password incorrect"
            });
        }

        return formatJSONResponse({
            user
        });


    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})

export const deleteUser = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
        const user = await usersService.deleteUser(id)
        return formatJSONResponse({
            user, id
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})