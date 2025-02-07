"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Swal from "sweetalert2";
import ProtectedRoute from "@/app/components/protectedroute";
import { v4 as uuidv4 } from 'uuid';
import { FaDollarSign, FaShoppingCart, FaClock, FaCheckCircle } from 'react-icons/fa'; 



interface Order {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  totalAmount: number;
  discount: number;
  orderDate: string;
  status: string | null;
  cartItems: { productName: string; image: string }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
            _id,
            name, 
            email,
            address,
            city,
            zipCode,
            totalAmount, 
            discount,
            orderDate,
            status,
            cartItems[]->{
              productName,
              image
            }
          }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client
        .patch(orderId)
        .set({ status: newStatus })
        .commit();
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (newStatus === "dispatch") {
        Swal.fire("Dispatch", "The order is now dispatched.", "success");
      } else if (newStatus === "success") {
        Swal.fire("Success", "The order has been completed.", "success");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire("Error!", "Something went wrong while updating the status.", "error");
    }
  };

  // Dummy data for the UI
  const totalRevenue = 1500;
  const totalOrders = 2;
  const pendingOrders = 2;
  const completedOrders = 1;

 

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-blue-600 text-white p-4 shadow-lg flex justify-between">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </nav>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaDollarSign className="text-3xl text-blue-600 mr-4" />
              <div>
                <p className="text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}\</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaShoppingCart className="text-3xl text-green-600 mr-4" />
              <div>
                <p className="text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaClock className="text-3xl text-yellow-600 mr-4" />
              <div>
                <p className="text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold">{pendingOrders}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaCheckCircle className="text-3xl text-purple-600 mr-4" />
              <div>
                <p className="text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold">{completedOrders}</p>
              </div>
            </div>
          </div>

          
        

          {/* Orders Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-8">
            <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
              <thead className="bg-gray-50 text-blue-800">
                <tr>
                  <th className="px-4 py-2 text-center">ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="cursor-pointer hover:bg-red-100 transition-all"
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <td className="px-4 py-2 text-center">{`ORD-${uuidv4()}`}</td>
                      <td className="px-4 py-2 text-left">{order.name}</td>
                      <td className="px-4 py-2 text-left">{order.address}</td>
                      <td className="px-4 py-2 text-left">${order.totalAmount}</td>
                      <td>
                        <select
                          value={order.status || ""}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-gray-100 p-1 rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="dispatch">Dispatch</option>
                          <option value="success">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(order._id);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {selectedOrderId === order._id && (
                      <tr>
                        <td colSpan={7} className="bg-gray-50 p-4 transition-all animate-fadeIn">
                          <h3 className="font-bold">Order Details</h3>
                          <p><strong>Phone:</strong> {order.phone}</p>
                          <p><strong>Email:</strong> {order.email}</p>
                          <p><strong>City:</strong> {order.city}</p>
                          <ul>
                            {order.cartItems.map((item, index) => (
                              <li key={`${order._id}-${index}`} className="flex items-center gap-2">
                                {item.productName}
                                {item.image && (
                                  <Image src={urlFor(item.image).url()} width={40} height={40} alt={item.productName} />
                                )}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
