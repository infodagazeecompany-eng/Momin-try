const { neon } = require("@neondatabase/serverless");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        error: "DATABASE_URL is not configured."
      });
    }

    const {
      name,
      phone,
      address,
      city,
      product,
      quantity,
      price,
      total
    } = req.body || {};

    if (!name || !phone || !address || !city || !product) {
      return res.status(400).json({
        error: "Please fill all required fields."
      });
    }

    const qty = Number(quantity);
    const unitPrice = Number(price);
    const orderTotal = Number(total);

    const orderId =
      "ORD-" +
      Date.now().toString().slice(-8) +
      Math.floor(100 + Math.random() * 900);

    const sql = neon(process.env.DATABASE_URL);

    await sql`
      INSERT INTO orders
      (
        order_id,
        name,
        phone,
        address,
        city,
        product,
        quantity,
        price,
        total,
        status
      )
      VALUES
      (
        ${orderId},
        ${name},
        ${phone},
        ${address},
        ${city},
        ${product},
        ${qty},
        ${unitPrice},
        ${orderTotal},
        'Pending'
      )
    `;

    return res.status(201).json({
      success: true,
      orderId: orderId
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Order save nahi ho saka."
    });
  }
};
