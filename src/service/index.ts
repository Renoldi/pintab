import dynamoDBClient from "../model";
import UserServerice from "./service"

const todoService = new UserServerice(dynamoDBClient());

export default todoService;