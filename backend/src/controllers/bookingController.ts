import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/types";

const prisma = new PrismaClient();

// --- GET tất cả bookings ---
export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        users: true,
        ticketTypes: true,
        bookingDetails: {
          include: {
            ticketPrice: true
          }
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
          include: {
            ticketPrice: true
          }
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

    if (!b.user_id || !b.ticket_type_id || !b.pickup_address || !b.departure_date ||
        !b.name || !b.phone || !b.email || !b.total_price || !b.priceCategories) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, ticket_type_id, pickup_address, departure_date, name, phone, email, total_price, priceCategories"
      });
    }

    if (!Array.isArray(b.priceCategories) || b.priceCategories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "priceCategories must be a non-empty array"
      });
    }

    for (const pc of b.priceCategories) {
      if (!pc.categoryId || !pc.quantity || pc.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Each priceCategory must have categoryId and quantity >= 1"
        });
      }
    }

    const ticketPricePromises = b.priceCategories.map(async (pc: any) => {
      const ticketPrice = await prisma.ticketPrice.findFirst({
        where: {
          ticketTypeId: b.ticket_type_id,
          categoryId: pc.categoryId
        }
      });

      if (!ticketPrice) {
        throw new Error(`Ticket price not found for ticketTypeId: ${b.ticket_type_id}, categoryId: ${pc.categoryId}`);
      }

      return {
        ticketPriceId: ticketPrice.ticketPriceId,
        categoryId: pc.categoryId,
        quantity: pc.quantity,
        price: ticketPrice.price
      };
    });

    const ticketPriceData = await Promise.all(ticketPricePromises);

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId: b.user_id,
          ticketTypeId: b.ticket_type_id,
          pickupAddress: b.pickup_address,
          departureDate: new Date(b.departure_date),
          name: b.name,
          phone: b.phone,
          email: b.email,
          status: "pending",
          paymentType: "unpaid",
          totalPrice: b.total_price,
          specialRequests: b.special_requests || null,
        }
      });

      const bookingDetails = await Promise.all(
        ticketPriceData.map(tp =>
          tx.bookingDetail.create({
            data: {
              bookingId: booking.bookingId,
              ticketPriceId: tp.ticketPriceId,
              quantity: tp.quantity,
              totalPrice: tp.quantity * tp.price
            }
          })
        )
      );

      return { booking, bookingDetails };
    });

    const bookingWithDetails = await prisma.booking.findUnique({
      where: { bookingId: result.booking.bookingId },
      include: {
        bookingDetails: {
          include: {
            ticketPrice: true
          }
        },
        ticketTypes: true,
        users: true
      }
    });

    res.status(201).json({ success: true, data: bookingWithDetails });
  } catch (err: any) {
    console.error('Create booking error:', err);
    if (err.message.includes('Ticket price not found')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
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
      include: {
        users: true,
        ticketTypes: true,
        bookingDetails: {
          include: {
            ticketPrice: true
          }
        }
      },
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

// --- CANCEL booking ---
export const cancelBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user.userId;

    const booking = await prisma.booking.findUnique({
      where: { bookingId: id },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ success: false, message: "You can only cancel your own bookings" });
    }

    if (booking.status !== "pending" && booking.status !== "processing") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status: ${booking.status}. Only pending or processing bookings can be cancelled.`
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { bookingId: id },
      data: { status: "cancelled" },
      include: {
        ticketTypes: {
          include: {
            tour: {
              select: {
                tourId: true,
                name: true,
                images: true,
              }
            }
          }
        },
        bookingDetails: {
          include: {
            ticketPrice: {
              include: {
                priceCategory: true
              }
            }
          }
        }
      }
    });

    res.json({ success: true, data: updatedBooking });
  } catch (err: any) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- GET bookings của user hiện tại ---
export const getUserBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user.userId;

    const bookings = await prisma.booking.findMany({
      where: { userId: userId },
      include: {
        ticketTypes: {
          include: {
            tour: {
              select: {
                tourId: true,
                name: true,
                images: true,
              }
            }
          }
        },
        bookingDetails: {
          include: {
            ticketPrice: {
              include: {
                priceCategory: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedBookings = bookings.map(booking => {
      const participants = booking.bookingDetails.reduce((sum, detail) => sum + detail.quantity, 0);
      const tour = booking.ticketTypes.tour;
      
      return {
        bookingId: booking.bookingId,
        tourId: tour.tourId,
        tourName: tour.name,
        tourImage: tour.images && tour.images.length > 0 ? tour.images[0] : null,
        bookingDate: booking.createdAt,
        startDate: booking.departureDate,
        status: booking.status === "pending" ? "processing" : booking.status,
        totalPrice: booking.totalPrice,
        participants: participants,
        pickupAddress: booking.pickupAddress,
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        paymentType: booking.paymentType,
        specialRequests: booking.specialRequests,
        ticketTypeName: booking.ticketTypes.name,
        bookingDetails: booking.bookingDetails.map(detail => ({
          bookingDetailId: detail.bookingDetailId,
          quantity: detail.quantity,
          totalPrice: detail.totalPrice,
          categoryName: detail.ticketPrice.priceCategory.name,
          price: detail.ticketPrice.price,
        })),
      };
    });

    res.json({ success: true, data: formattedBookings });
  } catch (err: any) {
    console.error('Get user bookings error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

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