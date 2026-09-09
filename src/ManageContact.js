import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaEye,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import "./ManageContact.css";

const API_URL = "http://localhost:5000";

export default function Managecontact() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // ============================================================
  // GET ALL CONTACT MESSAGES
  // ============================================================

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/contacts`
      );

      const contentType =
        response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          `Server returned an invalid response (${response.status})`
        );
      }

      const data = await response.json();

      console.log("CONTACT API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch contact messages"
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid contact messages data received from server"
        );
      }

      setMessages(data);
    } catch (error) {
      console.error(
        "FETCH CONTACT ERROR:",
        error
      );

      setMessages([]);

      alert(
        `Failed to load messages.\n\n${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD MESSAGES
  // ============================================================

  useEffect(() => {
    fetchMessages();
  }, []);

  // ============================================================
  // MARK MESSAGE AS READ
  // ============================================================

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/contacts/${id}/read`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to mark message as read"
        );
      }

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === id
            ? {
                ...message,
                status: "Read",
              }
            : message
        )
      );

      setSelectedMessage((prevMessage) => {
        if (
          prevMessage &&
          prevMessage._id === id
        ) {
          return {
            ...prevMessage,
            status: "Read",
          };
        }

        return prevMessage;
      });
    } catch (error) {
      console.error(
        "MARK MESSAGE READ ERROR:",
        error
      );

      alert(
        `Failed to mark message as read.\n\n${error.message}`
      );
    }
  };

  // ============================================================
  // VIEW MESSAGE
  // ============================================================

  const viewMessage = async (message) => {
    setSelectedMessage(message);

    if (message.status === "Unread") {
      await markAsRead(message._id);
    }
  };

  // ============================================================
  // DELETE MESSAGE
  // ============================================================

  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/contacts/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete message"
        );
      }

      setMessages((prevMessages) =>
        prevMessages.filter(
          (message) => message._id !== id
        )
      );

      setSelectedMessage((prevMessage) => {
        if (
          prevMessage &&
          prevMessage._id === id
        ) {
          return null;
        }

        return prevMessage;
      });
    } catch (error) {
      console.error(
        "DELETE MESSAGE ERROR:",
        error
      );

      alert(
        `Failed to delete message.\n\n${error.message}`
      );
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const formattedDate = new Date(
      date
    );

    if (isNaN(formattedDate.getTime())) {
      return "-";
    }

    return formattedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ============================================================
  // COUNTS
  // ============================================================

  const unreadCount = messages.filter(
    (message) =>
      message.status === "Unread"
  ).length;

  const readCount =
    messages.length - unreadCount;

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="manage-contact-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="manage-contact-header">
        <div>
          <Link
            to="/Admindashboard"
            className="back-dashboard"
          >
            <FaArrowLeft />
            Back to Dashboard
          </Link>

          <h1>Messages</h1>

          <p>
            View and manage customer contact messages
          </p>
        </div>

        <div className="message-summary">
          <div className="message-summary-icon">
            <FaEnvelope />
          </div>

          <div>
            <span>Total Messages</span>
            <strong>{messages.length}</strong>
          </div>
        </div>
      </div>

      {/* ======================================================
          MESSAGE STATS
      ====================================================== */}

      <div className="message-stats">

        <div className="message-stat-card">
          <div className="message-stat-icon total">
            <FaEnvelope />
          </div>

          <div>
            <span>Total Messages</span>
            <strong>{messages.length}</strong>
          </div>
        </div>

        <div className="message-stat-card">
          <div className="message-stat-icon unread">
            <FaEnvelope />
          </div>

          <div>
            <span>Unread Messages</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        <div className="message-stat-card">
          <div className="message-stat-icon read">
            <FaCheck />
          </div>

          <div>
            <span>Read Messages</span>
            <strong>{readCount}</strong>
          </div>
        </div>

      </div>

      {/* ======================================================
          MESSAGES CARD
      ====================================================== */}

      <div className="messages-card">

        <div className="messages-card-header">
          <div>
            <h2>Customer Messages</h2>

            <p>
              Messages received from the Contact Us page
            </p>
          </div>

          <button
            className="refresh-message-btn"
            onClick={fetchMessages}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading ? (
          <div className="messages-loading">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (

          /* ==================================================
             NO MESSAGES
          ================================================== */

          <div className="no-messages">
            <FaEnvelope />

            <h3>No Messages Found</h3>

            <p>
              Customer messages will appear here
              when someone contacts you.
            </p>
          </div>

        ) : (

          /* ==================================================
             MESSAGE TABLE
          ================================================== */

          <div className="messages-table-wrapper">

            <table className="messages-table">

              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {messages.map((message) => (

                  <tr
                    key={message._id}
                    className={
                      message.status === "Unread"
                        ? "unread-row"
                        : ""
                    }
                  >

                    <td>
                      <div className="customer-name">
                        {message.name || "-"}
                      </div>
                    </td>

                    <td>
                      <div className="customer-email">
                        {message.email || "-"}
                      </div>
                    </td>

                    <td>
                      <div className="subject-text">
                        {message.subject || "-"}
                      </div>
                    </td>

                    <td>
                      <div className="message-preview">
                        {message.message || "-"}
                      </div>
                    </td>

                    <td>
                      <div className="message-date">
                        {formatDate(
                          message.createdAt
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`message-status ${
                          message.status === "Unread"
                            ? "status-unread"
                            : "status-read"
                        }`}
                      >
                        {message.status || "Unread"}
                      </span>
                    </td>

                    <td>

                      <div className="message-actions">

                        {/* VIEW */}

                        <button
                          type="button"
                          className="view-message-btn"
                          onClick={() =>
                            viewMessage(message)
                          }
                          title="View Message"
                        >
                          <FaEye />
                        </button>

                        {/* MARK AS READ */}

                        {message.status ===
                          "Unread" && (
                          <button
                            type="button"
                            className="read-message-btn"
                            onClick={() =>
                              markAsRead(
                                message._id
                              )
                            }
                            title="Mark as Read"
                          >
                            <FaCheck />
                          </button>
                        )}

                        {/* DELETE */}

                        <button
                          type="button"
                          className="delete-message-btn"
                          onClick={() =>
                            deleteMessage(
                              message._id
                            )
                          }
                          title="Delete Message"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ======================================================
          MESSAGE MODAL
      ====================================================== */}

      {selectedMessage && (

        <div
          className="message-modal-overlay"
          onClick={() =>
            setSelectedMessage(null)
          }
        >

          <div
            className="message-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="message-modal-header">

              <div>
                <span>
                  Customer Message
                </span>

                <h2>
                  {selectedMessage.subject}
                </h2>
              </div>

              <button
                type="button"
                className="close-message-modal"
                onClick={() =>
                  setSelectedMessage(null)
                }
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="message-modal-body">

              <div className="message-detail">
                <span>Name</span>

                <strong>
                  {selectedMessage.name}
                </strong>
              </div>

              <div className="message-detail">
                <span>Email</span>

                <strong>
                  {selectedMessage.email}
                </strong>
              </div>

              <div className="message-detail">
                <span>Date</span>

                <strong>
                  {formatDate(
                    selectedMessage.createdAt
                  )}
                </strong>
              </div>

              <div className="message-detail">
                <span>Status</span>

                <strong
                  className={
                    selectedMessage.status ===
                    "Unread"
                      ? "modal-unread"
                      : "modal-read"
                  }
                >
                  {selectedMessage.status}
                </strong>
              </div>

              <div className="message-content">

                <span>Message</span>

                <p>
                  {selectedMessage.message}
                </p>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="message-modal-footer">

              <button
                type="button"
                className="modal-close-btn"
                onClick={() =>
                  setSelectedMessage(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="modal-delete-btn"
                onClick={() =>
                  deleteMessage(
                    selectedMessage._id
                  )
                }
              >
                <FaTrash />
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}