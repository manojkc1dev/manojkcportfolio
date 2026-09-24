import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Inbox,
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  RefreshCw,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  type Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured, useAuth, handleFirestoreError, OperationType } from '../firebase';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: Timestamp | { seconds: number; nanoseconds: number } | string;
  read?: boolean;
  replied?: boolean;
}

interface AdminInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminInboxModal: React.FC<AdminInboxModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    if (!db || !isFirebaseConfigured || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const items: ContactMessage[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || 'Anonymous',
          email: data.email || 'No email',
          message: data.message || '',
          createdAt: data.createdAt,
          read: data.read || false,
          replied: data.replied || false,
        });
      });

      setMessages(items);
      if (items.length > 0 && !selectedMessage) {
        setSelectedMessage(items[0]);
      }
    } catch (err: unknown) {
      console.error('Error loading messages from Firestore:', err);
      try {
        handleFirestoreError(err, OperationType.LIST, 'messages');
      } catch (structuredErr: unknown) {
        setError(structuredErr instanceof Error ? structuredErr.message : String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();
    }
  }, [isOpen, user]);

  const toggleReadStatus = async (msg: ContactMessage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!db) return;

    const newStatus = !msg.read;
    try {
      const docRef = doc(db, 'messages', msg.id);
      await updateDoc(docRef, { read: newStatus });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: newStatus } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage((prev) => (prev ? { ...prev, read: newStatus } : null));
      }
    } catch (err) {
      console.error('Could not update read state:', err);
    }
  };

  const deleteMessage = async (msgId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!db) return;
    if (!window.confirm('Are you sure you want to permanently delete this message?')) return;

    try {
      await deleteDoc(doc(db, 'messages', msgId));
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      if (selectedMessage?.id === msgId) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Could not delete message:', err);
    }
  };

  const formatMessageDate = (raw?: Timestamp | { seconds: number; nanoseconds: number } | string) => {
    if (!raw) return 'Recently';
    if (typeof raw === 'string') return new Date(raw).toLocaleDateString();
    if ('toDate' in raw && typeof raw.toDate === 'function') {
      return raw.toDate().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if ('seconds' in raw) {
      return new Date(raw.seconds * 1000).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return 'Recently';
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'unread' && m.read) return false;
    if (filter === 'read' && !m.read) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-inbox-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl h-[85vh] max-h-[780px] rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="admin-inbox-title" className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                      Inquiries &amp; Messages
                    </h2>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Received from your portfolio contact form
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchMessages}
                  disabled={loading}
                  aria-label="Refresh messages"
                  className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Layout: 2-column on larger screens */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
              {/* Left Column: List & Filters */}
              <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-neutral-50/30 dark:bg-neutral-900/30">
                {/* Search & Filter bar */}
                <div className="p-3 border-b border-neutral-200/80 dark:border-neutral-800/80 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search messages..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 text-xs">
                    <Filter className="w-3 h-3 text-neutral-400 mr-1" />
                    <button
                      type="button"
                      onClick={() => setFilter('all')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                        filter === 'all'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      All ({messages.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilter('unread')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                        filter === 'unread'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      Unread ({unreadCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilter('read')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                        filter === 'read'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      Read ({messages.length - unreadCount})
                    </button>
                  </div>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {loading && messages.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-400">
                      <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
                      Loading inbox...
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-400">
                      <Mail className="w-8 h-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-700" />
                      No messages found.
                    </div>
                  ) : (
                    filteredMessages.map((msg) => {
                      const isSelected = selectedMessage?.id === msg.id;
                      return (
                        <div
                          key={msg.id}
                          onClick={() => {
                            setSelectedMessage(msg);
                            if (!msg.read) toggleReadStatus(msg);
                          }}
                          className={`p-3.5 transition-colors cursor-pointer text-left ${
                            isSelected
                              ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-2 border-indigo-600'
                              : 'hover:bg-neutral-100/60 dark:hover:bg-neutral-800/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-xs font-semibold truncate ${
                                !msg.read
                                  ? 'text-neutral-900 dark:text-white'
                                  : 'text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              {msg.name}
                            </span>
                            <span className="text-[11px] text-neutral-400 shrink-0 flex items-center gap-1 font-mono">
                              <Clock className="w-2.5 h-2.5" />
                              {formatMessageDate(msg.createdAt)}
                            </span>
                          </div>

                          <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate mb-1">
                            {msg.email}
                          </div>

                          <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                            {msg.message}
                          </p>

                          <div className="mt-2 flex items-center justify-between pt-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                !msg.read
                                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                              }`}
                            >
                              {!msg.read ? 'New' : 'Read'}
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => toggleReadStatus(msg, e)}
                                title={msg.read ? 'Mark as unread' : 'Mark as read'}
                                className="p-1 rounded text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => deleteMessage(msg.id, e)}
                                title="Delete message"
                                className="p-1 rounded text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Selected Message Reader */}
              <div className="w-full md:w-7/12 flex-1 flex flex-col bg-white dark:bg-neutral-900 p-6 overflow-y-auto">
                {selectedMessage ? (
                  <div className="space-y-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                            {selectedMessage.name}
                          </h3>
                          <a
                            href={`mailto:${selectedMessage.email}`}
                            className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                          >
                            <span>{selectedMessage.email}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs text-neutral-400 font-mono block">
                            {formatMessageDate(selectedMessage.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="flex-1 text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed bg-neutral-50/50 dark:bg-neutral-800/30 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                      {selectedMessage.message}
                    </div>

                    {/* Action Footer */}
                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleReadStatus(selectedMessage)}
                          className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          {selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMessage(selectedMessage.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          Delete
                        </button>
                      </div>

                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re:%20Inquiry%20from%20manojkc1.com.np`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 p-8">
                    <Inbox className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mb-3" />
                    <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                      Select a message to preview
                    </p>
                    <p className="text-xs text-neutral-400 max-w-xs mt-1">
                      Choose any inquiry from the list on the left to read details and reply.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
