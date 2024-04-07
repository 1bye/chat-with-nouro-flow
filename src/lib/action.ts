import { deserialize } from "$app/forms";

export type ActionErrorData = {
	statusMessage?: string,
	message?: string,
	status?: number
}

export class ActionError<T extends ActionErrorData = ActionErrorData, S extends number = 400 | 200 | 500> extends Error {
	data: T;
	status: S;
	fallbackMessage: string = "Something was happened"

	constructor(data: T, status: S) {
		super(JSON.stringify({ data, status }));
		this.status = status;
		this.data = data;
	}

	toJson() {
		return {
			data: this.data,
			status: this.status
		}
	}

	getStatusMessage(str?: string) {
		return this.data?.statusMessage ?? this.data?.message ?? str ?? this.fallbackMessage;
	}
}

export function fileToFormData(file: File) {
	const formData = new FormData();
	formData.append("file", file);
	return formData;
}

/**
 * Action: get
 * @param action
 * @param body
 * @param json
 */

export async function actionFetch<T = object>(action: string, body: object | File = {}, json: boolean = false): Promise<T> {
	const url = new URL(document.location.href);
	const res = await fetch(`${url.origin}${url.pathname}?/${action}`, {
		method: 'POST',
		body: (body instanceof File ? fileToFormData(body) : body instanceof FormData ? body : JSON.stringify(body)),
	});

	const g = await res.text();
	const { data, type, status } = deserialize(g) as unknown as {
		data: T,
		type: "failure" | "success",
		status: 400 | 200 | 500
	};

	if (type === "failure") {
		throw new ActionError(data as object, status);
	}

	return data as T;
}