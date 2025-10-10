import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderStatus } from "../lib/api";
import InfoRow from "../components/atoms/InfoRow";
import { maskId, formatDate } from "../lib/format";
import { MainLayout } from "../components/templates/MainLayout";

interface OrderStatus {
  orderId: string;
  status: "Placed" | "Packed" | "Shipped" | "Delivered";
  carrier?: string;
  eta?: string;
}

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderStatus | null>(null);

  useEffect(() => {
    if (id) {
      const status = getOrderStatus(id);
      setOrder(status);
    }
  }, [id]);

  if (!order) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Loading order status...</p>
        </div>
      </MainLayout>
    );
  }

  const statusColor =
    order.status === "Delivered"
      ? "text-green-600"
      : order.status === "Shipped"
      ? "text-blue-600"
      : "text-gray-700";

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Order Status</h1>

        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-4">
          <InfoRow label="Order ID" value={maskId(order.orderId)} />
          <InfoRow
            label="Status"
            value={order.status}
            valueClassName={`font-bold ${statusColor}`}
          />
          {order.carrier && <InfoRow label="Carrier" value={order.carrier} />}
          {order.eta && <InfoRow label="ETA" value={formatDate(order.eta)} />}
        </div>

        <div className="mt-6">
          <Link to="/" className="text-blue-600 hover:underline font-medium">
            ← Back to Catalog
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
