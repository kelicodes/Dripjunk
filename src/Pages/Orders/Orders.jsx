import { useContext, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext";
import "./Orders.css";

const OrdersPage = () => {
  const { orders, fetchOrders } = useContext(ShopContext);

  useEffect(() => {
    fetchOrders(); // fetch orders on mount
  }, []);

  return (
    <div className="orders-page-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`order-status ${order.status}`}>
                {order.status}
              </span>
            </p>
            <p>
              <strong>Total:</strong> KES {order.totalAmount}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
