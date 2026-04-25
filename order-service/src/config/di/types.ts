export const TYPES = {
	OrderRepository: Symbol.for("OrderRepository"),
	UserServiceClient: Symbol.for("UserServiceClient"),

	// Use Cases
	CreateOrder: Symbol.for("CreateOrder"),
	UpdateOrderStatus: Symbol.for("UpdateOrderStatus"),
	GetOrderById: Symbol.for("GetOrderById"),
	GetOrderByUser: Symbol.for("GetOrderByUser"),

	// HTTP
	OrderController: Symbol.for("OrderController"),
	OrderRoutes: Symbol.for("OrderRoutes"),
	JwtService: Symbol.for("JwtService"),
	AuthMiddleware: Symbol.for("AuthMiddleware"),
};
