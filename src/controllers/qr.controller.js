import qrcode from "qrcode";

export const generateGymCheckInQR = async (req, res) => {
  try {
    const { gym_id } = req.query;

    if (!gym_id) {
      return res
        .status(400)
        .json({ success: false, message: "gym_id is required" });
    }

    const checkInUrl = `${process.env.FRONTEND_URL}/checkin?gym_id=${gym_id}`;
    const qrCode = await qrcode.toDataURL(checkInUrl);

    res.json({
      success: true,
      gym_id,
      checkInUrl,
      qrCode,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
