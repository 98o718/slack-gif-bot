import { Handler } from '@netlify/functions';

import { fetchRandomGiphyGif } from '../giphy-api/gif-data-source';
import { makeSlackImageMessage } from '../slack-api/message-maker';

const unknownErrorMessage = 'Unknown error';

export function makeGifHandler(tag: string): Handler {
	return async () => {
		try {
			const src = await fetchRandomGiphyGif(tag);

			const message = makeSlackImageMessage(src, `${tag} gif`);

			return {
				statusCode: 200,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(message),
			};
		} catch (error) {
			const message = error instanceof Error ? error.message ?? unknownErrorMessage : unknownErrorMessage;

			return {
				statusCode: 500,
				body: JSON.stringify({ error: message }),
			};
		}
	};
}
