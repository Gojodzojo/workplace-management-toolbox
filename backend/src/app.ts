import express, { json, static as staticDir } from 'express';
import cors from 'cors';
import { resolve as resolvePath } from 'path';
import { compare, hash } from 'bcrypt';
import { config as loadEnv } from 'dotenv';
import { sign, verify } from 'jsonwebtoken';
import type { TypedRequest, TypedResponse, UserDbEntry } from './usefullTypes';
import type { AccessTokenRquest, AddReservationRequest, AuthData } from '$common/RequestTypes';
import type { AccessTokenResponse, StatusResponse, TokensResponse } from '$common/ResponseTypes';
import type { Reservation, Workplace } from '$common/types';

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
let fakeReservationDb: Reservation[] = [];
const fakeWorkplaceDb: Workplace[] = [
	{ number: 1, description: 'this is description for workplace 1' },
	{ number: 2, description: 'this is description for workplace 2' },
	{ number: 3, description: 'this is description for workplace 3' }
];

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

	const accessToken = sign({ id: foundUser.id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
	const refreshToken = sign({ id: foundUser.id }, REFRESH_TOKEN_SECRET, { expiresIn: '1y' });

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
	console.log(hashedPassword);

	let id = 0;
	while (true) {
		id = Math.round(Math.random() * 10000) % 10000;
		if (!fakeUserDB.some((u) => u.id === id)) break;
	}

	fakeUserDB.push({ username, hashedPassword, id });

	const accessToken = sign({ id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
	const refreshToken = sign({ id }, REFRESH_TOKEN_SECRET, { expiresIn: '1y' });

	console.log(`Registered. Username: ${username}, password: ${password}`);
	res.json({ accessToken, refreshToken });
});

app.post(
	'/token',
	(req: TypedRequest<AccessTokenRquest>, res: TypedResponse<AccessTokenResponse>) => {
		const { refreshToken } = req.body;

		verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, payload) => {
			if (err || !payload || typeof payload === 'string') {
				res.status(401).json({ status: 'Bad refresh token' });
				return;
			}

			const { id } = payload;
			const accessToken = sign({ id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
			res.json({ accessToken });
		});
	}
);

app.put(
	'/add-reservation',
	(req: TypedRequest<AddReservationRequest>, res: TypedResponse<StatusResponse>) => {
		const { accessToken, date, workplaceNumber } = req.body;

		verify(accessToken, ACCESS_TOKEN_SECRET, async (err, payload) => {
			if (err || !payload || typeof payload === 'string') {
				res.status(401).json({ status: 'Bad access token' });
				return;
			}

			const isWorkplaceTaken = fakeReservationDb.some(
				(r) => r.date === date && r.workplaceNumber === workplaceNumber
			);
			if (isWorkplaceTaken) {
				// Dodać kod błędu
				res.json({ status: 'Workplace already taken' });
				return;
			}

			const { id: userId } = payload;
			fakeReservationDb.push({ date, userId, workplaceNumber });

			res.json({ status: 'Success' });
		});
	}
);

app.get('*', (_, res) => {
	res.sendFile(resolvePath(__dirname + '/../public/index.html'));
});

app.listen(port, function () {
	console.log(`App is listening on port ${port}!`);
});
