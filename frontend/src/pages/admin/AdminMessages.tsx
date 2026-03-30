// AdminMessages.tsx — Phase 3
// Customer support inbox: view messages, mark read/unread, reply via email, delete
// Requires: GET /api/messages, PUT /api/messages/:id, DELETE /api/messages/:id
import { useEffect, useState } from "react";
import { get, put, del } from "@/utils/api";
import { formatDateTime } from "@/utils/format";
import "../../assets/css/adminMessages.css";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

type Filter = "all" | "unread" | "read" | "replied";

export default function AdminMessages() {
  const [messages, setMessages]     = useState<Message[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState<Filter>("all");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState<Message | null>(null);
  const [deleting, setDeleting]     = useState<string | null>(null);
  const [toast, setToast]           = useState("");

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = () => {
    setLoading(true);
    get<Message[]>("/api/messages")
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openMessage = async (m: Message) => {
    setSelected(m);
    if (!m.read) {
      try {
        const updated = await put<Message>(`/messages/${m._id}`, { read: true });
        setMessages((prev) => prev.map((x) => (x._id === m._id ? updated : x)));
        setSelected(updated);
      } catch { /* silent */ }
    }
  };

  const toggleRead = async (m: Message, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await put<Message>(`/messages/${m._id}`, { read: !m.read });
      setMessages((prev) => prev.map((x) => (x._id === m._id ? updated : x)));
      if (selected?._id === m._id) setSelected(updated);
    } catch {
      showToast("Failed to update message");
    }
  };

  const markReplied = async (m: Message) => {
    try {
      const updated = await put<Message>(`/messages/${m._id}`, { replied: true, read: true });
      setMessages((prev) => prev.map((x) => (x._id === m._id ? updated : x)));
      setSelected(updated);
      showToast("Marked as replied");
    } catch {
      showToast("Failed to update");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await del(`/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selected?._id === id) setSelected(null);
      showToast("Message deleted");
    } catch {
      showToast("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = messages.filter((m) => {
    const matchFilter =
      filter === "all" ||
      (filter === "unread"  && !m.read) ||
      (filter === "read"    && m.read && !m.replied) ||
      (filter === "replied" && m.replied);
    const matchSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="msg-wrap">
      {toast && <div className="msg-toast">{toast}</div>}

      {/* Top bar */}
      <div className="msg-topbar">
        <div>
          <h1>
            Messages
            {unreadCount > 0 && <span className="msg-unread-badge">{unreadCount}</span>}
          </h1>
          <p className="msg-breadcrumb">Admin / <span>Messages</span></p>
        </div>
      </div>

      <div className="msg-body">
        {/* Stats */}
        <div className="msg-stats">
          <div className="msg-stat">
            <i className="fas fa-envelope msg-icon-blue" />
            <div>
              <p className="msg-stat-val">{messages.length}</p>
              <p className="msg-stat-lbl">Total</p>
            </div>
          </div>
          <div className="msg-stat">
            <i className="fas fa-envelope-open msg-icon-orange" />
            <div>
              <p className="msg-stat-val">{unreadCount}</p>
              <p className="msg-stat-lbl">Unread</p>
            </div>
          </div>
          <div className="msg-stat">
            <i className="fas fa-reply msg-icon-green" />
            <div>
              <p className="msg-stat-val">{messages.filter((m) => m.replied).length}</p>
              <p className="msg-stat-lbl">Replied</p>
            </div>
          </div>
          <div className="msg-stat">
            <i className="fas fa-clock msg-icon-purple" />
            <div>
              <p className="msg-stat-val">{messages.filter((m) => !m.replied).length}</p>
              <p className="msg-stat-lbl">Pending</p>
            </div>
          </div>
        </div>

        {/* Main panel: list + detail */}
        <div className="msg-panel">
          {/* LEFT: message list */}
          <div className="msg-list-col">
            {/* Search + filters */}
            <div className="msg-list-controls">
              <div className="msg-search">
                <i className="fas fa-search" />
                <input
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="msg-filters">
                {(["all", "unread", "read", "replied"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    className={`msg-filter-btn ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                    {f === "unread" && unreadCount > 0 && (
                      <span className="msg-filter-badge">{unreadCount}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="msg-loading">
                <div className="msg-spinner" /> Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="msg-empty-list">
                <i className="fas fa-inbox" />
                <p>No messages</p>
              </div>
            ) : (
              <div className="msg-list">
                {filtered.map((m) => (
                  <div
                    key={m._id}
                    className={`msg-row ${selected?._id === m._id ? "msg-row-active" : ""} ${!m.read ? "msg-row-unread" : ""}`}
                    onClick={() => openMessage(m)}
                  >
                    <div className="msg-row-avatar">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="msg-row-info">
                      <div className="msg-row-top">
                        <span className="msg-row-name">{m.name}</span>
                        <span className="msg-row-time">{formatDateTime(m.createdAt)}</span>
                      </div>
                      <p className="msg-row-subject">{m.subject}</p>
                      <p className="msg-row-preview">
                        {m.body.slice(0, 80)}{m.body.length > 80 ? "..." : ""}
                      </p>
                    </div>
                    <div className="msg-row-actions">
                      {m.replied && (
                        <span className="msg-replied-dot" title="Replied">
                          <i className="fas fa-reply" />
                        </span>
                      )}
                      <button
                        className="msg-read-btn"
                        onClick={(e) => toggleRead(m, e)}
                        title={m.read ? "Mark unread" : "Mark read"}
                      >
                        <i className={`fas ${m.read ? "fa-envelope-open" : "fa-envelope"}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: message detail */}
          <div className="msg-detail-col">
            {!selected ? (
              <div className="msg-detail-empty">
                <i className="fas fa-inbox" />
                <p>Select a message to read it</p>
              </div>
            ) : (
              <div className="msg-detail">
                {/* Detail header */}
                <div className="msg-detail-head">
                  <div className="msg-detail-avatar">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="msg-detail-meta">
                    <p className="msg-detail-name">{selected.name}</p>
                    <p className="msg-detail-email">{selected.email}</p>
                    <p className="msg-detail-time">{formatDateTime(selected.createdAt)}</p>
                  </div>
                  <div className="msg-detail-badges">
                    {selected.replied && (
                      <span className="msg-badge-replied">
                        <i className="fas fa-reply" /> Replied
                      </span>
                    )}
                    {!selected.read && (
                      <span className="msg-badge-unread">Unread</span>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="msg-detail-subject">
                  <strong>Subject:</strong> {selected.subject}
                </div>

                {/* Body */}
                <div className="msg-detail-body">
                  {selected.body.split("\n").map((line, i) => (
                    <p key={i}>{line || <br />}</p>
                  ))}
                </div>

                {/* Actions */}
                <div className="msg-detail-actions">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}&body=%0A%0A---%0AOriginal message from ${selected.name}:%0A${encodeURIComponent(selected.body)}`}
                    className="msg-reply-btn"
                    onClick={() => markReplied(selected)}
                  >
                    <i className="fas fa-reply" /> Reply via Email
                  </a>

                  {!selected.replied && (
                    <button className="msg-mark-btn" onClick={() => markReplied(selected)}>
                      <i className="fas fa-check" /> Mark as Replied
                    </button>
                  )}

                  <button
                    className="msg-del-btn"
                    onClick={() => deleteMessage(selected._id)}
                    disabled={deleting === selected._id}
                  >
                    {deleting === selected._id
                      ? <i className="fas fa-spinner fa-spin" />
                      : <><i className="fas fa-trash" /> Delete</>
                    }
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
