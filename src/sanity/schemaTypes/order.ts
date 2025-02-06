const orderSchema = {
    name: "order",
    type: "document",
    title: "Orders",
    fields: [
      { name: "name", type: "string", title: "Customer Name" },
      { name: "email", type: "string", title: "Email" },
      { name: "address", type: "string", title: "Address" },
      { name: "city", type: "string", title: "City" },
      { name: "postalCode", type: "string", title: "Postal Code" },
      { name: "country", type: "string", title: "Country" },
      {
        name: "cart",
        type: "array",
        title: "Cart Items",
        of: [
          {
            type: "object",
            fields: [
              { name: "price", type: "number", title: "Price" },
              { name: "discount", type: "number", title: "Discount" },
              { name: "quantity", type: "number", title: "Quantity" },
              { name: "totalPrice", type: "number", title: "Total Price" },
            ],
          },
        ],
      },
      { name: "totalAmount", type: "number", title: "Total Amount" },
      {
        name: "status",
        type: "string",
        title: "Status",
        options: { list: ["pending", "shipped", "delivered"] },
      },
      { name: "createdAt", type: "datetime", title: "Created At" },
    ],
  };
  
  export default orderSchema;
  