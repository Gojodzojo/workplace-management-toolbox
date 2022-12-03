import express, { json, static as staticDir } from 'express';
import cors from 'cors';
import { resolve as resolvePath } from 'path';
import { compare, hash } from 'bcrypt';
import { config as loadEnv } from 'dotenv';
import { sign, verify } from 'jsonwebtoken';
import type { TypedRequest, TypedResponse, UserDbEntry } from './usefullTypes';
import type {
	AccessTokenRequest,
	AddReservationRequest,
	AuthData,
	GetFreeWorkplacesRequest,
	GetUserReservationsRequest
} from '$common/RequestTypes';
import type {
	AccessTokenResponse,
	GetFreeWorkplacesResponse,
	GetUserReservationsResponse,
	StatusResponse,
	TokensResponse
} from '$common/ResponseTypes';
import type { Reservation, Workplace } from '$common/types';
import { espFetch } from './espFetch';

const SALT_ROUNDS = 10;
const port = 3001;
const TIMEOUT = 60000;

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
	{
		number: 1,
		description: 'this is description for workplace 1',
		espUrl: 'http://192.168.5.52',
		computerUrl: 'http://192.168.5.52'
	},
	{ number: 2, description: 'this is description for workplace 2', espUrl: '', computerUrl: '' },
	{ number: 3, description: 'this is description for workplace 3', espUrl: '', computerUrl: '' }
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

	let id = 0;
	while (true) {
		id = Math.round(Math.random() * 10000) % 10000;
		if (!fakeUserDB.some((u) => u.id === id)) break;
	}

	fakeUserDB.push({ username, hashedPassword, id });

	const accessToken = sign({ id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
	const refreshToken = sign({ id }, REFRESH_TOKEN_SECRET, { expiresIn: '1y' });

	res.json({ accessToken, refreshToken });
});

app.post(
	'/token',
	(req: TypedRequest<AccessTokenRequest>, res: TypedResponse<AccessTokenResponse>) => {
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
			updateWorkplaces();

			res.json({ status: 'Success' });
		});
	}
);

app.post(
	'/get-user-reservations',
	(
		req: TypedRequest<GetUserReservationsRequest>,
		res: TypedResponse<GetUserReservationsResponse>
	) => {
		const { accessToken } = req.body;

		verify(accessToken, ACCESS_TOKEN_SECRET, async (err, payload) => {
			if (err || !payload || typeof payload === 'string') {
				res.status(401).json({ status: 'Bad access token' });
				return;
			}

			const { id: userId } = payload;
			const response: GetUserReservationsResponse = {
				reservations: []
			};

			fakeReservationDb.forEach(({ userId: uid, date, workplaceNumber }) => {
				if (uid !== userId) return;
				const { description } = fakeWorkplaceDb.find((w) => w.number === workplaceNumber)!;

				response.reservations.push({ date, description, workplaceNumber });
			});

			res.json(response);
		});
	}
);

app.post(
	'/get-free-workplaces',
	(req: TypedRequest<GetFreeWorkplacesRequest>, res: TypedResponse<GetFreeWorkplacesResponse>) => {
		const { date } = req.body;

		let workplaces = fakeWorkplaceDb.map(({ number: workplaceNumber, description }) => ({
			workplaceNumber,
			description
		}));

		fakeReservationDb.forEach((r) => {
			if (r.date === date) {
				workplaces = workplaces.filter((w) => w.workplaceNumber !== r.workplaceNumber);
			}
		});

		res.json({ workplaces });
	}
);

let timeout: NodeJS.Timeout | undefined;

app.get('/button', async (req: TypedRequest<{}, { wp: string }, {}>, res: TypedResponse) => {
	const { wp } = req.query;
	const workplace = fakeWorkplaceDb.find(({ number }) => number.toString() === wp);

	if (!workplace) return;

	await espFetch(workplace.computerUrl, 'GET');

	if (timeout) {
		clearTimeout(timeout);
	}

	timeout = setTimeout(() => {
		espFetch(workplace.espUrl + '?peadlock=1', 'GET');
	}, TIMEOUT);

	await espFetch(workplace.espUrl + '?peadlock=0', 'GET');

	res.send('Success');
});

app.get('/startup', (req: TypedRequest, res: TypedResponse) => {
	updateWorkplaces();
	res.send('Success');
});

app.get('*', (_, res) => {
	res.sendFile(resolvePath(__dirname + '/../public/index.html'));
});

app.listen(port, function () {
	console.log(`App is listening on port ${port}!`);
});

const msPerDay = 1000 * 60 * 60 * 24;

function updateWorkplaces() {
	// fakeReservationDb = fakeReservationDb.filter(
	// 	(reservation) =>
	// 		plDateStringToDate(reservation.date).valueOf() + msPerDay < new Date().valueOf()
	// );

	fakeReservationDb.sort(
		(a, b) => plDateStringToDate(a.date).valueOf() - plDateStringToDate(b.date).valueOf()
	);

	fakeWorkplaceDb.forEach((workplace) => {
		const closestReservation = fakeReservationDb.find(
			(reservation) => reservation.workplaceNumber === workplace.number
		);
		if (!closestReservation) return;

		const numString = ('000' + closestReservation.userId).slice(-4);
		espFetch(`${workplace.espUrl}?data=${numString}`, 'GET').catch(console.error);
	});
}

function plDateStringToDate(s: string) {
	const [day, month, year] = s.split('.');
	return new Date(`${month}.${day}.${year}`);
}
