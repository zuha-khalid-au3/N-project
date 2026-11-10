import { Inquiry } from '../models/Inquiry.js';
import { failure, success } from '../utils/response.js';

export async function createInquiry(req, res, next) {
  try {
    const inquiry = await Inquiry.create({
      ...req.body,
      productId: req.body.productId || null,
      status: 'new',
    });
    return success(res, { inquiry }, 'Enquiry submitted successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function listInquiries(req, res, next) {
  try {
    const items = await Inquiry.find().sort({ createdAt: -1 }).limit(100).lean();
    return success(res, { items });
  } catch (error) {
    return next(error);
  }
}

export async function updateInquiry(req, res, next) {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).lean();
    if (!inquiry) {
      return failure(res, 'NOT_FOUND', 'Inquiry not found', 404);
    }
    return success(res, { inquiry }, 'Inquiry updated successfully');
  } catch (error) {
    return next(error);
  }
}
