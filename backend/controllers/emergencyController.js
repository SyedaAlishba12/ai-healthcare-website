import EmergencyContact from "../models/EmergencyContact.js";

/*
 Get Emergency Contacts
*/

export const getEmergencyContacts = async (req, res) => {
  try {
    const { type } = req.query;

    let filter = {};

    // Filter by type if provided
    if (type) {
      filter.type = type.toLowerCase();
    }

    const contacts = await EmergencyContact.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Emergency Contacts Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};