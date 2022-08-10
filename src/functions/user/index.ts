import { handlerPath } from '@libs/handler-resolver';

export const getAllUsers = {
    handler: `${handlerPath(__dirname)}/handler.getAllUsers`,
    events: [
        {
            http: {
                method: 'get',
                path: 'user/',
            },
        },
    ],
};

export const createUser = {
    handler: `${handlerPath(__dirname)}/handler.createUser`,
    events: [
        {
            http: {
                method: 'post',
                path: 'user',
            },
        },
    ],
};

export const loginUser = {
    handler: `${handlerPath(__dirname)}/handler.loginUser`,
    events: [
        {
            http: {
                method: 'post',
                path: 'user/login',
            },
        },
    ],
};

export const getUser = {
    handler: `${handlerPath(__dirname)}/handler.getUser`,
    events: [
        {
            http: {
                method: 'get',
                path: 'user/{id}',
            },
        },
    ],
};

export const updateUser = {
    handler: `${handlerPath(__dirname)}/handler.updateUser`,
    events: [
        {
            http: {
                method: 'put',
                path: 'user/{id}',
            },
        },
    ],
};

export const deleteUser = {
    handler: `${handlerPath(__dirname)}/handler.deleteUser`,
    events: [
        {
            http: {
                method: 'delete',
                path: 'user/{id}',
            },
        },
    ],
};