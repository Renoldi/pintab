import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import usersService from '../../service'

import { v4 } from "uuid";
import { hashPass, verify } from "../../service/bcryptjs"
import { generateToken } from "src/service/jwt";

import * as yup from "yup";
import User from "src/model/User";

const schema = yup.object().shape({
    name: yup.string().required(),
    password: yup.string().required(),
});


export const getAllUsers = middyfy(async (): Promise<APIGatewayProxyResult> => {
    const users = await usersService.getAllUsers();
    return formatJSONResponse({
        users
    })
})

export const createUser = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

        const reqBody:User = JSON.parse(JSON.stringify(event.body))
        await schema.validate(reqBody, { abortEarly: false });

        const id = v4();
        const passwordh = await hashPass(reqBody.password)
        const user = await usersService.createUser({
            ...reqBody,
            id: id,
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
        const reqBody:User = JSON.parse(JSON.stringify(event.body))
        await schema.validate(reqBody, { abortEarly: false });
        const passwordh = await hashPass(reqBody.password)
        const user = await usersService.updateUser(id, {
            ...reqBody,
            password: passwordh,
            updatedAt: new Date().toISOString(),
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

export const loginUser = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
        const reqBody:User = JSON.parse(JSON.stringify(event.body))
        await schema.validate(reqBody, { abortEarly: false });
        const users = await usersService.loginUser(
            reqBody.name
        )

        const user = users[0]
        const veri = await verify(reqBody.password, user.password)
        if (!veri) {
            return formatJSONResponse({
                status: 500,
                message: "password incorrect"
            });
        }

        const token = generateToken({ ...user, password: '' })

        return formatJSONResponse({
            "token": token
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