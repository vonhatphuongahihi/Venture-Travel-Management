import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// --- GET tất cả bookings ---
export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        users: true,
        ticketTypes: true,
        bookingDetails: {
          include: { ticketPrice: true }
        }
      },
      orderBy: { createdAt: "desc" },
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
    const booking = await prisma.booking.findUnique({
      where: { bookingId: id },
      include: {
        users: true,
        ticketTypes: true,
        bookingDetails: {
          include: { ticketPrice: true }
        }
      },
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

    if (!b.userId || !b.ticketTypeId || !b.pickupAddress || !b.departureDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: b.userId,
        ticketTypeId: b.ticketTypeId,
        pickupAddress: b.pickupAddress,
        departureDate: new Date(b.departureDate),
        name: b.name,
        phone: b.phone,
        email: b.email,
        status: b.status ?? "pending",
        paymentType: b.paymentType ?? "cash",
        totalPrice: b.totalPrice ?? 0,
        specialRequests: b.specialRequests ?? null,
        bookingDetails: b.bookingDetails ? {
          create: b.bookingDetails.map((d: any) => ({
            ticketPriceId: d.ticketPriceId,
            quantity: d.quantity,
            totalPrice: d.totalPrice
          }))
        } : undefined
      },
      include: { users: true, ticketTypes: true, bookingDetails: { include: { ticketPrice: true } } },
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- UPDATE booking ---
export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const booking = await prisma.booking.update({
      where: { bookingId: id },
      data,
      include: { users: true, ticketTypes: true, bookingDetails: { include: { ticketPrice: true } } },
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
    await prisma.booking.delete({ where: { bookingId: id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};



