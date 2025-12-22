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
        ticketTypes: {
          include: {
            tour: {
              select: {
                tourId: true,
                name: true,
                images: true,
                duration: true,
                about: true,
              }
            }
          }
        },
        bookingDetails: {
          include: {
            ticketPrice: {
              include: {
                priceCategory: {
                  select: {
                    categoryId: true,
                    name: true,
                    description: true,
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Format response để frontend dễ sử dụng
    const formattedBookings = bookings.map(booking => ({
      bookingId: booking.bookingId,
      userId: booking.userId,
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      pickupAddress: booking.pickupAddress,
      departureDate: booking.departureDate,
      status: booking.status,
      paymentType: booking.paymentType,
      totalPrice: booking.totalPrice,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      // Thông tin tour
      tour: booking.ticketTypes.tour ? {
        tourId: booking.ticketTypes.tour.tourId,
        name: booking.ticketTypes.tour.name,
        images: booking.ticketTypes.tour.images,
        duration: booking.ticketTypes.tour.duration,
        about: booking.ticketTypes.tour.about,
      } : null,
      // Thông tin loại vé
      ticketType: {
        ticketTypeId: booking.ticketTypes.ticketTypeId,
        name: booking.ticketTypes.name,
        notes: booking.ticketTypes.notes,
      },
      // Chi tiết vé đã đặt
      bookingDetails: booking.bookingDetails.map(detail => ({
        bookingDetailId: detail.bookingDetailId,
        ticketPriceId: detail.ticketPriceId,
        quantity: detail.quantity,
        totalPrice: detail.totalPrice,
        ticketTypeName: booking.ticketTypes.name,
        // Thông tin loại giá vé (người lớn, trẻ em, ...)
        priceCategory: detail.ticketPrice.priceCategory ? {
          categoryId: detail.ticketPrice.priceCategory.categoryId,
          name: detail.ticketPrice.priceCategory.name,
          description: detail.ticketPrice.priceCategory.description,
        } : null,
        // Giá vé
        price: detail.ticketPrice.price,
      })),
    }));

    res.json({ success: true, data: formattedBookings });
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
        ticketTypes: {
          include: {
            tour: {
              select: {
                tourId: true,
                name: true,
                images: true,
                duration: true,
                about: true,
              }
            }
          }
        },
        bookingDetails: {
          include: {
            ticketPrice: {
              include: {
                priceCategory: {
                  select: {
                    categoryId: true,
                    name: true,
                    description: true,
                  }
                }
              }
            }
          }
        }
      },
    });
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });
    
    // Format response
    const formattedBooking = {
      bookingId: booking.bookingId,
      userId: booking.userId,
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      pickupAddress: booking.pickupAddress,
      departureDate: booking.departureDate,
      status: booking.status,
      paymentType: booking.paymentType,
      totalPrice: booking.totalPrice,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      // Thông tin tour
      tour: booking.ticketTypes.tour ? {
        tourId: booking.ticketTypes.tour.tourId,
        name: booking.ticketTypes.tour.name,
        images: booking.ticketTypes.tour.images,
        duration: booking.ticketTypes.tour.duration,
        about: booking.ticketTypes.tour.about,
      } : null,
      // Thông tin loại vé
      ticketType: {
        ticketTypeId: booking.ticketTypes.ticketTypeId,
        name: booking.ticketTypes.name,
        notes: booking.ticketTypes.notes,
      },
      // Chi tiết vé đã đặt
      bookingDetails: booking.bookingDetails.map(detail => ({
        bookingDetailId: detail.bookingDetailId,
        ticketPriceId: detail.ticketPriceId,
        quantity: detail.quantity,
        totalPrice: detail.totalPrice,
        ticketTypeName: booking.ticketTypes.name,
        // Thông tin loại giá vé (người lớn, trẻ em, ...)
        priceCategory: detail.ticketPrice.priceCategory ? {
          categoryId: detail.ticketPrice.priceCategory.categoryId,
          name: detail.ticketPrice.priceCategory.name,
          description: detail.ticketPrice.priceCategory.description,
        } : null,
        // Giá vé
        price: detail.ticketPrice.price,
      })),
    };

    return res.json({ success: true, data: formattedBooking });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- CREATE booking ---
export const createBooking = async (req: Request, res: Response) => {
  try {
    const b = req.body;


    // Validate các field bắt buộc
    if (!b.ticket_type_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: ticket_type_id"
      });
    }

    if (!b.name || !b.phone || !b.email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, phone, email"
      });
    }

    if (!b.total_price && b.total_price !== 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: total_price"
      });
    }

    if (!b.priceCategories || !Array.isArray(b.priceCategories) || b.priceCategories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: priceCategories (must be a non-empty array)"
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
      // Xử lý user_id - có thể null hoặc empty, nếu không có thì tìm hoặc tạo user guest
      let userId = b.user_id;
      if (!userId || (typeof userId === "string" && userId.trim() === "")) {
        // Tìm hoặc tạo user guest nếu không có user_id
        let guestUser = await tx.user.findFirst({
          where: { email: "guest@venture.com" }
        });
        if (!guestUser) {
          // Tạo user guest mặc định nếu chưa có
          guestUser = await tx.user.create({
            data: {
              name: "Guest User",
              email: "guest@venture.com",
              password: null,
              role: "GUEST",
            }
          });
        }
        userId = guestUser.userId;
      }

      const booking = await tx.booking.create({
        data: {
          userId: userId,
          ticketTypeId: b.ticket_type_id,
          pickupAddress: b.pickup_address || "", // Cho phép empty string
          departureDate: b.departure_date ? new Date(b.departure_date) : new Date(), // Mặc định là ngày hiện tại nếu không có
          name: b.name,
          phone: b.phone,
          email: b.email,
          status: b.status === "confirmed" ? "confirmed" : b.status === "cancelled" ? "cancelled" : "pending",
          paymentType: b.payment_type || "unpaid",
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
            ticketPrice: {
              include: {
                priceCategory: {
                  select: {
                    categoryId: true,
                    name: true,
                    description: true,
                  }
                }
              }
            }
          }
        },
        ticketTypes: {
          include: {
            tour: {
              select: {
                tourId: true,
                name: true,
                images: true,
                duration: true,
                about: true,
              }
            }
          }
        },
        users: true
      }
    });

    if (!bookingWithDetails) {
      return res.status(500).json({ success: false, message: "Failed to retrieve created booking" });
    }

    // Format response
    const formattedBooking = {
      bookingId: bookingWithDetails.bookingId,
      userId: bookingWithDetails.userId,
      name: bookingWithDetails.name,
      phone: bookingWithDetails.phone,
      email: bookingWithDetails.email,
      pickupAddress: bookingWithDetails.pickupAddress,
      departureDate: bookingWithDetails.departureDate,
      status: bookingWithDetails.status,
      paymentType: bookingWithDetails.paymentType,
      totalPrice: bookingWithDetails.totalPrice,
      specialRequests: bookingWithDetails.specialRequests,
      createdAt: bookingWithDetails.createdAt,
      updatedAt: bookingWithDetails.updatedAt,
      tour: bookingWithDetails.ticketTypes.tour ? {
        tourId: bookingWithDetails.ticketTypes.tour.tourId,
        name: bookingWithDetails.ticketTypes.tour.name,
        images: bookingWithDetails.ticketTypes.tour.images,
        duration: bookingWithDetails.ticketTypes.tour.duration,
        about: bookingWithDetails.ticketTypes.tour.about,
      } : null,
      ticketType: {
        ticketTypeId: bookingWithDetails.ticketTypes.ticketTypeId,
        name: bookingWithDetails.ticketTypes.name,
        notes: bookingWithDetails.ticketTypes.notes,
      },
      bookingDetails: bookingWithDetails.bookingDetails.map(detail => ({
        bookingDetailId: detail.bookingDetailId,
        ticketPriceId: detail.ticketPriceId,
        quantity: detail.quantity,
        totalPrice: detail.totalPrice,
        ticketTypeName: bookingWithDetails.ticketTypes.name,
        priceCategory: detail.ticketPrice.priceCategory ? {
          categoryId: detail.ticketPrice.priceCategory.categoryId,
          name: detail.ticketPrice.priceCategory.name,
          description: detail.ticketPrice.priceCategory.description,
        } : null,
        price: detail.ticketPrice.price,
      })),
    };

    res.status(201).json({ success: true, data: formattedBooking });
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
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;
    if (data.email) updateData.email = data.email;
    if (data.pickupAddress) updateData.pickupAddress = data.pickupAddress;
    if (data.departureDate) updateData.departureDate = new Date(data.departureDate);
    if (data.paymentType) updateData.paymentType = data.paymentType;
    if (data.specialRequests) updateData.specialRequests = data.specialRequests;
    if (data.totalPrice) updateData.totalPrice = data.totalPrice;

    // Update ticketTypeId
    if (data.ticketTypeId) {
      updateData.ticketTypeId = data.ticketTypeId;
    }

    // Chuẩn hóa status
    if (data.status) {
      if (data.status === "confirmed") updateData.status = "confirmed";
      else if (data.status === "cancelled" || data.status === "canceled")
        updateData.status = "cancelled";
      else updateData.status = "pending";
    }

    // Transaction update booking + bookingDetails
    const result = await prisma.$transaction(async (tx) => {
      // Update booking
      const booking = await tx.booking.update({
        where: { bookingId: id },
        data: updateData,
        include: {
          users: true,
          ticketTypes: {
            include: {
              tour: {
                select: {
                  tourId: true,
                  name: true,
                  images: true,
                  duration: true,
                  about: true,
                },
              },
            },
          },
          bookingDetails: {
            include: {
              ticketPrice: {
                include: { priceCategory: true },
              },
            },
          },
        },
      });

      // Update bookingDetails nếu có gửi lên
      if (Array.isArray(data.bookingDetails)) {
        await tx.bookingDetail.deleteMany({
          where: { bookingId: id },
        });

        if (data.bookingDetails.length > 0) {
          const bookingDetailsData = await Promise.all(
            data.bookingDetails.map(async (detail: any) => {
              if (!detail.ticketPriceId) {
                throw new Error("Missing ticketPriceId");
              }

              const ticketPrice = await tx.ticketPrice.findUnique({
                where: { ticketPriceId: detail.ticketPriceId },
                include: { priceCategory: true },
              });

              if (!ticketPrice) {
                throw new Error(`Ticket price not found: ${detail.ticketPriceId}`);
              }

              return {
                bookingId: id,
                ticketPriceId: detail.ticketPriceId,
                quantity: detail.quantity || 1,
                totalPrice:
                  (ticketPrice.price || detail.price || 0) *
                  (detail.quantity || 1),
              };
            })
          );

          await tx.bookingDetail.createMany({ data: bookingDetailsData });
        }
      }

      // Return booking sau khi update full
      return tx.booking.findUnique({
        where: { bookingId: id },
        include: {
          users: true,
          ticketTypes: {
            include: {
              tour: {
                select: {
                  tourId: true,
                  name: true,
                  images: true,
                  duration: true,
                  about: true,
                },
              },
            },
          },
          bookingDetails: {
            include: {
              ticketPrice: {
                include: { priceCategory: true },
              },
            },
          },
        },
      });
    });

    // Nếu null → lỗi
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // FORMAT RESPONSE
    const formattedBooking = {
      bookingId: result.bookingId,
      userId: result.userId,
      name: result.name,
      phone: result.phone,
      email: result.email,
      pickupAddress: result.pickupAddress,
      departureDate: result.departureDate,
      status: result.status,
      paymentType: result.paymentType,
      totalPrice: result.totalPrice,
      specialRequests: result.specialRequests,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,

      tour: result.ticketTypes?.tour
        ? {
            tourId: result.ticketTypes.tour.tourId,
            name: result.ticketTypes.tour.name,
            images: result.ticketTypes.tour.images,
            duration: result.ticketTypes.tour.duration,
            about: result.ticketTypes.tour.about,
          }
        : null,

      ticketType: result.ticketTypes
        ? {
            ticketTypeId: result.ticketTypes.ticketTypeId,
            name: result.ticketTypes.name,
            notes: result.ticketTypes.notes,
          }
        : null,

      bookingDetails: result.bookingDetails.map((detail) => ({
        bookingDetailId: detail.bookingDetailId,
        ticketPriceId: detail.ticketPriceId,
        quantity: detail.quantity,
        totalPrice: detail.totalPrice,
        ticketTypeName: result.ticketTypes?.name || "",
        priceCategory: detail.ticketPrice.priceCategory
          ? {
              categoryId: detail.ticketPrice.priceCategory.categoryId,
              name: detail.ticketPrice.priceCategory.name,
              description: detail.ticketPrice.priceCategory.description,
            }
          : null,
        price: detail.ticketPrice.price,
      })),
    };

    return res.json({ success: true, data: formattedBooking });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
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

