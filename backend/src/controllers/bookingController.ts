import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// --- GET tất cả bookings ---
export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.bookings.findMany({
      include: { users: true, tours: true },
      orderBy: { booked_at: "desc" },
    });
    res.json({ success: true, data: bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- GET booking theo ID ---
export const getBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const booking = await prisma.bookings.findUnique({
      where: { booking_id: id },
      include: { users: true, tours: true },
    });
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });
    return res.json({ success: true, data: booking });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- CREATE booking ---
export const createBooking = async (req: Request, res: Response) => {
  try {
    const b = req.body;

    if (!b.user_id || !b.tour_id || !b.startAt || !b.quantity) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const booking = await prisma.bookings.create({
      data: {
        user_id: b.user_id,
        tour_id: b.tour_id,
        start_at: new Date(b.startAt),
        booked_at: b.bookedAt ? new Date(b.bookedAt) : undefined,
        status: b.status ?? "pending",
        payment_status: b.paymentStatus ?? "unpaid",
        quantity: Number(b.quantity),
        note: b.note ?? null,
      },
      include: { users: true, tours: true },
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// --- UPDATE booking ---
export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const booking = await prisma.bookings.update({
      where: { booking_id: id },
      data,
      include: { users: true, tours: true },
    });
    res.json({ success: true, data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- DELETE booking ---
export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.bookings.delete({ where: { booking_id: id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy tất cả tour
export const getTours = async (req: Request, res: Response) => {
  try {
    const tours = await prisma.tour.findMany({
      orderBy: { createdAt: "desc" }, 
      select: {
        tourId: true,
        name: true,
      }
    });
    res.json({ success: true, data: tours });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};