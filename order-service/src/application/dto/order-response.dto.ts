export type OrderResponseDTO = {
	id: string;
	userId: string;
	item: string;
	quantity: number;
	price: number;
	status: string;
	createdAt: Date;
};
