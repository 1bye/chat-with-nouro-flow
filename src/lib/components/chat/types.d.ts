
export type Message = {
	id: number;
	type: "human" | "ai" | "system";
	content: string;
	to: "root" | string;
}