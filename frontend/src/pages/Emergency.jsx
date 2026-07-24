import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";

import {
  getEmergencyContacts,
  getEmergencyByType,
} from "../services/emergencyService";

const emergencyTypes = [
  "All",
  "ambulance",
  "hospital",
  "bloodbank",
  "police",
];

const Emergency = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    fetchContacts();
  }, [selectedType]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      let result;

      if (selectedType === "All") {
        result = await getEmergencyContacts();
      } else {
        result = await getEmergencyByType(selectedType);
      }

      setContacts(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load emergency contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const keyword = searchTerm.toLowerCase();

      return (
        contact.name.toLowerCase().includes(keyword) ||
        contact.address.toLowerCase().includes(keyword) ||
        contact.type.toLowerCase().includes(keyword)
      );
    });
  }, [contacts, searchTerm]);

  const getBadgeColor = (type) => {
    switch (type) {
      case "ambulance":
        return "bg-red-100 text-red-700";

      case "hospital":
        return "bg-blue-100 text-blue-700";

      case "bloodbank":
        return "bg-pink-100 text-pink-700";

      case "police":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-dark">
            Emergency Contacts
          </h1>

          <p className="mt-3 text-slate-500">
            Quickly access verified emergency services whenever you need
            immediate medical assistance.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-10 flex flex-col md:flex-row gap-5">
          <Input
            label="Search"
            placeholder="Search hospital, ambulance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />

          <div className="w-full md:w-64">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Filter by Type
            </label>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {emergencyTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "All"
                    ? "All Emergency Services"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-slate-500">
            Loading emergency contacts...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20 text-red-500">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredContacts.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No emergency contacts found.
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filteredContacts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <Card key={contact._id}>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-dark">
                    {contact.name}
                  </h2>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${getBadgeColor(
                      contact.type
                    )}`}
                  >
                    {contact.type}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    <strong>Phone:</strong> {contact.phone}
                  </p>

                  <p>
                    <strong>Address:</strong> {contact.address}
                  </p>

                  <p>
                    <strong>Description:</strong> {contact.description}
                  </p>

                  <p>
                    <strong>24 Hours:</strong>{" "}
                    {contact.available24Hours ? "Yes" : "No"}
                  </p>
                </div>

                <Button
                  variant="danger"
                  className="w-full mt-6"
                  onClick={() => window.open(`tel:${contact.phone}`)}
                >
                  Call Now
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Emergency;