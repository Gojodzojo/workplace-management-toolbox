import express, { json, static as staticDir } from 'express';
import cors from 'cors';
import { resolve as resolvePath } from 'path';
import { compare, hash } from 'bcrypt';
import { config as loadEnv } from 'dotenv';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import type { TypedRequest, TypedResponse, UserDbEntry } from './usefullTypes';
import type { AccessTokenRquest, AuthData } from '$common/RequestTypes';
import type { AccessTokenResponse, TokensResponse } from '$common/ResponseTypes';

const SALT_ROUNDS = 10;
const port = 3001;

loadEnv();
const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = process.env;

if (!(REFRESH_TOKEN_SECRET && ACCESS_TOKEN_SECRET)) {
	console.error('Tokens are undefined');
	process.exit(1);
}

const app = express();
app.use(cors());
app.use(json());
app.use(staticDir('public'));

let fakeUserDB: UserDbEntry[] = [];

app.post('/login', async (req: TypedRequest<AuthData>, res: TypedResponse<TokensResponse>) => {
	const { username, password } = req.body;
	const foundUser = fakeUserDB.find((entry) => entry.username === username);

	if (!foundUser) {
		res.status(401).json({ status: 'Wrong username' });
		return;
	}

	const isPasswordCorrect = await compare(password, foundUser.hashedPassword);
	if (!isPasswordCorrect) {
		res.status(401).json({ status: 'Wrong password' });
		return;
	}

	const accessToken = sign(username, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
	const refreshToken = sign(username, REFRESH_TOKEN_SECRET, { expiresIn: '1 year' });

	console.log(`Logged in. Username: ${username}, password: ${password}`);
	res.json({ accessToken, refreshToken });
});

app.put('/register', async (req: TypedRequest<AuthData>, res: TypedResponse<TokensResponse>) => {
	const { username, password } = req.body;
	const foundUser = fakeUserDB.find((entry) => entry.username === username);

	if (foundUser) {
		res.status(405).json({ status: 'User already exists' });
		return;
	}

	const hashedPassword = await hash(password, SALT_ROUNDS);
	fakeUserDB.push({ username, hashedPassword });

	const accessToken = sign(username, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
	const refreshToken = sign(username, REFRESH_TOKEN_SECRET, { expiresIn: '1y' });

	console.log(`Registered. Username: ${username}, password: ${password}`);
	res.json({ accessToken, refreshToken });
});

app.post(
	'/token',
	(req: TypedRequest<AccessTokenRquest>, res: TypedResponse<AccessTokenResponse>) => {
		const { refreshToken } = req.body;

		verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, username) => {
			if (err) {
				res.status(401).json({ status: 'Bad refresh token' });
				return;
			}

			console.log(username);
			const accessToken = sign(username as string, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
			res.json({ accessToken });
		});
	}
);

app.get('*', (_, res) => {
	res.sendFile(resolvePath(__dirname + '/../public/index.html'));
});

app.listen(port, function () {
	console.log(`App is listening on port ${port}!`);
});
