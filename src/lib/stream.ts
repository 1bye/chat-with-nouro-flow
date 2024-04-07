import { encode } from 'gpt-tokenizer';

export type ReadStreamOptions<S = ReadableStream> = {
	stream: S,
	chunk?: (chunk: string, tokens: number[]) => void,
	end?: () => void
}

export function parseSSEChunk(chunk: string) {
	const lines = chunk.split('\n');
	const result: Record<string, string | object> = {};

	lines.forEach(line => {
		const [key, value] = line.split(': ');
		if (key && value) {
			result[key.trim()] = value.trim();
		}
	});

	if (result.data) {
		result.data = JSON.parse(result.data as string);
	}

	return result;
}

export async function readStream({ stream, end, chunk }: ReadStreamOptions) {
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	const chunks: string[] = [];

	async function read() {
		const { value, done } = await reader.read();

		if (done) {
			end?.();
			return;
		}
		const str = decoder.decode(value);
		chunks.push(str);
		chunk?.(str, encode(chunks.join('')));
		await read();
	}

	await read();

	return { chunks };
}