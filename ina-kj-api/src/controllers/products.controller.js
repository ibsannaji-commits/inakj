const prisma = require('../config/db');
const { sendError } = require('../utils/errors');

async function list(req, res) {
  try {
    const {
      category,
      location,
      min_price,
      max_price,
      grade,
      q,
      seller_id,
      status = 'approved',
      page = '1',
      limit = '20',
    } = req.query;

    const take = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * take;

    const where = {
      status: status === 'all' && req.user?.role === 'admin' ? undefined : status,
    };
    if (category) where.category = { slug: category };
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (grade) where.grade = grade;
    if (seller_id) where.sellerId = seller_id;
    if (min_price || max_price) {
      where.priceEtb = {};
      if (min_price) where.priceEtb.gte = parseFloat(min_price);
      if (max_price) where.priceEtb.lte = parseFloat(max_price);
    }
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: [{ featuredUntil: 'desc' }, { createdAt: 'desc' }],
        include: {
          seller: {
            select: {
              id: true,
              fullName: true,
              isVerified: true,
              ratingAvg: true,
              location: true,
            },
          },
          category: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      data: items,
      meta: { total, page: parseInt(page, 10) || 1, limit: take },
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to list products');
  }
}

async function getOne(req, res) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            isVerified: true,
            ratingAvg: true,
            ratingCount: true,
            location: true,
            phone: true,
          },
        },
        category: true,
      },
    });
    if (!product) {
      return sendError(res, 404, 'NOT_FOUND', 'Product not found');
    }
    await prisma.product.update({
      where: { id: product.id },
      data: { viewsCount: { increment: 1 } },
    });
    return res.json({ data: product });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to get product');
  }
}

async function create(req, res) {
  try {
    const {
      name,
      categoryId,
      priceEtb,
      unit,
      quantityAvailable,
      minOrderQty,
      grade,
      location,
      description,
      isExportReady,
      isNegotiable,
      deliveryOption,
    } = req.body;

    if (!name || priceEtb == null || quantityAvailable == null) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'name, priceEtb, quantityAvailable required');
    }

    const product = await prisma.product.create({
      data: {
        sellerId: req.user.id,
        name,
        categoryId: categoryId || null,
        priceEtb,
        unit: unit || 'kg',
        quantityAvailable,
        minOrderQty: minOrderQty || 1,
        grade: grade || null,
        location: location || null,
        description: description || null,
        isExportReady: !!isExportReady,
        isNegotiable: !!isNegotiable,
        deliveryOption: deliveryOption || 'platform',
        status: 'pending',
      },
    });

    return res.status(201).json({ data: product });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to create product');
  }
}

async function update(req, res) {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return sendError(res, 404, 'NOT_FOUND', 'Product not found');
    }
    if (existing.sellerId !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'FORBIDDEN', 'Not your product');
    }

    const allowed = [
      'name', 'description', 'priceEtb', 'unit', 'quantityAvailable',
      'minOrderQty', 'grade', 'location', 'isExportReady', 'isNegotiable',
      'deliveryOption', 'categoryId', 'images',
    ];
    if (req.user.role === 'admin') allowed.push('status');

    const data = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
    });
    return res.json({ data: product });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to update product');
  }
}

async function remove(req, res) {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return sendError(res, 404, 'NOT_FOUND', 'Product not found');
    }
    if (existing.sellerId !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'FORBIDDEN', 'Not your product');
    }
    await prisma.product.update({
      where: { id: req.params.id },
      data: { status: 'inactive' },
    });
    return res.json({ data: { ok: true } });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to delete product');
  }
}

module.exports = { list, getOne, create, update, remove };
