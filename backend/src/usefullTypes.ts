import type { Request, Response } from 'express';
import type { Send, Query, ParamsDictionary } from 'express-serve-static-core';

export interface TypedRequest<
	BodyType = {},
	QueryType extends Query = {},
	ParamsType extends ParamsDictionary = {}
> extends Request {
	body: BodyType;
	params: ParamsType;
	query: QueryType;
}

export interface TypedResponse<ResBody = never> extends Response {
	json: Send<ResBody, this>;
}

export interface UserDbEntry {
	username: string;
	id: number;
	hashedPassword: string;
}
