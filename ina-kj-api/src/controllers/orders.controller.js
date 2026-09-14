const prisma = require('../config/db');
const config = require('../config');
const { sendError } = require('../utils/errors');

function nextOrderNumber() {
  const n = Date.now().toString().slice(-6);
  return `ORD-${n}`;
}

/**
 * Create order — server recalculates all money fields.
 */
async function create(req, res) {
  try {
    const { items, deliveryMethod, deliveryAddress, paymentMethod, notes } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'items required');
    }

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'approved' },
    });
    if (products.length !== productIds.length) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'One or more products unavailable');
    }

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const p = productMap[item.productId];
      const qty = parseFloat(item.quantity);
      if (!qty || qty < parseFloat(p.minOrderQty)) {
        return sendError(res, 400, 'VALIDATION_ERROR', `Min order for ${p.name}: ${p.minOrderQty}`);
      }
      if (qty > parseFloat(p.quantityAvailable)) {
        return sendError(res, 400, 'VALIDATION_ERROR', `Insufficient stock for ${p.name}`);
      }
      const unitPrice = parseFloat(p.priceEtb);
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;
      orderItemsData.push({
        productId: p.id,
        sellerId: p.sellerId,
        quantity: qty,
        unitPrice,
        lineTotal,
      });
    }

    const deliveryFee =
      deliveryMethod === 'pickup' ? 0 : config.defaultDeliveryFee;
    const platformFee = Math.round(subtotal * config.commissionRate * 100) / 100;
    const total = subtotal + deliveryFee + platformFee;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: nextOrderNumber(),
          buyerId: req.user.id,
          status: 'pending',
          subtotal,
          deliveryFee,
          platformFee,
          total,
          deliveryMethod: deliveryMethod || 'platform',
          deliveryAddress: deliveryAddress || null,
          paymentMethod: paymentMethod || null,
          paymentStatus: 'pending',
          notes: notes || null,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });

      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantityAvailable: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return res.status(201).json({ data: order });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to create order');
  }
}

async function list(req, res) {
  try {
    const where = {};
    if (req.user.role === 'buyer') {
      where.buyerId = req.user.id;
    } else if (req.user.role === 'farmer') {
      where.items = { some: { sellerId: req.user.id } };
    }
    // admin: no filter

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: { select: { id: true, name: true, images: true } } } },
        buyer: { select: { id: true, fullName: true, phone: true } },
      },
      take: 50,
    });
    return res.json({ data: orders });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to list orders');
  }
}

async function getOne(req, res) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: true,
            seller: { select: { id: true, fullName: true, phone: true } },
          },
        },
        buyer: { select: { id: true, fullName: true, phone: true } },
        delivery: true,
        payments: true,
      },
    });
    if (!order) {
      return sendError(res, 404, 'NOT_FOUND', 'Order not found');
    }

    const isBuyer = order.buyerId === req.user.id;
    const isSeller = order.items.some((i) => i.sellerId === req.user.id);
    const isAdmin = req.user.role === 'admin';
    if (!isBuyer && !isSeller && !isAdmin) {
      return sendError(res, 403, 'FORBIDDEN', 'Access denied');
    }

    return res.json({ data: order });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to get order');
  }
}

async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = [
      'pending', 'paid', 'processing', 'picked_up',
      'in_transit', 'delivered', 'cancelled',
    ];
    if (!allowed.includes(status)) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid status');
    }

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });
    if (!order) {
      return sendError(res, 404, 'NOT_FOUND', 'Order not found');
    }

    const isSeller = order.items.some((i) => i.sellerId === req.user.id);
    if (!isSeller && req.user.role !== 'admin') {
      return sendError(res, 403, 'FORBIDDEN', 'Access denied');
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status },
    });
    return res.json({ data: updated });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to update status');
  }
}

module.exports = { create, list, getOne, updateStatus };
