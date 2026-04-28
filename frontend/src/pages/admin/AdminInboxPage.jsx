import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Search, Eye, Archive, ArchiveRestore, Mail, MailOpen, Trash2, X, Image as ImageIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const KINDS = [
  { key: 'contacts', label: 'Contacts' },
  { key: 'finance_applications', label: 'Finance Apps' },
  { key: 'trade_ins', label: 'Trade-Ins' },
  { key: 'glass_repairs', label: 'Glass Repairs' },
  { key: 'service_requests', label: 'Service/Parts/Body' },
  { key: 'warranty_appointments', label: 'Warranty Appt' },
  { key: 'warranty_info_requests', label: 'Warranty Info' },
  { key: 'schedule_visits', label: 'Visit Requests' },
  { key: 'referrals', label: 'Referrals' },
  { key: 'purchase_requests', label: 'Purchase Requests' },
  { key: 'car_finder_requests', label: 'Car Finder' }
];

const getDisplayName = (item) => {
  if (item.firstName || item.lastName) return `${item.firstName || ''} ${item.lastName || ''}`.trim();
  if (item.name) return item.name;
  if (item.referralFirstName) return `Referral: ${item.referralFirstName} ${item.referralLastName || ''}`.trim();
  return 'Unknown';
};

const formatDate = (iso) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
};

// Hide non-user fields in detail view
const HIDDEN_FIELDS = new Set(['id', 'read', 'archived', 'createdAt', 'updatedAt', 'photos', 'damagePhoto', 'insuranceCard', 'dlFile']);

const PhotoThumbnail = ({ photo, label, onClick }) => {
  if (!photo) return null;
  const src = photo.base64 ? `data:${photo.contentType || 'image/png'};base64,${photo.base64}` : null;
  return (
    <button
      type="button"
      onClick={() => src && onClick(src, label)}
      className="group relative block w-full overflow-hidden rounded border border-gray-200 bg-gray-50 aspect-[4/3]"
      data-testid={`photo-thumb-${label}`}
    >
      {src ? (
        <img src={src} alt={label} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <ImageIcon className="w-8 h-8" />
          <p className="text-xs mt-1">{photo.filename || 'No data'}</p>
        </div>
      )}
      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs px-2 py-1 capitalize">{label}</div>
    </button>
  );
};

const DetailModal = ({ item, kind, onClose, onMarkRead, onToggleArchive, onDelete }) => {
  const [imageOverlay, setImageOverlay] = useState(null);
  if (!item) return null;

  const photoEntries = [];
  if (item.photos && typeof item.photos === 'object') {
    Object.entries(item.photos).forEach(([slot, p]) => photoEntries.push({ slot, photo: p }));
  }
  if (item.damagePhoto) photoEntries.push({ slot: 'damagePhoto', photo: item.damagePhoto });
  if (item.insuranceCard) photoEntries.push({ slot: 'insuranceCard', photo: item.insuranceCard });
  if (item.dlFile) photoEntries.push({ slot: 'dlFile', photo: item.dlFile });

  const renderValue = (val) => {
    if (val === null || val === undefined || val === '') return <span className="text-gray-400">—</span>;
    if (Array.isArray(val)) return val.length ? val.join(', ') : <span className="text-gray-400">—</span>;
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return String(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto" onClick={onClose} data-testid="submission-detail-modal">
      <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-xl my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{getDisplayName(item)}</h2>
            <p className="text-sm text-gray-500">{formatDate(item.createdAt)} &middot; {kind.replace(/_/g, ' ')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded" data-testid="close-modal"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-6 py-4 flex flex-wrap gap-2 border-b bg-gray-50">
          <button
            onClick={() => onMarkRead(item, !item.read)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
            data-testid="toggle-read"
          >
            {item.read ? <><Mail className="w-4 h-4" /> Mark Unread</> : <><MailOpen className="w-4 h-4" /> Mark Read</>}
          </button>
          <button
            onClick={() => onToggleArchive(item, !item.archived)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
            data-testid="toggle-archive"
          >
            {item.archived ? <><ArchiveRestore className="w-4 h-4" /> Unarchive</> : <><Archive className="w-4 h-4" /> Archive</>}
          </button>
          <button
            onClick={() => onDelete(item)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white border border-red-300 text-red-600 rounded hover:bg-red-50"
            data-testid="delete-submission"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <a
            href={`mailto:${item.email || item.yourEmail || ''}`}
            className="ml-auto inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Reply via Email
          </a>
        </div>

        {photoEntries.length > 0 && (
          <div className="px-6 py-4 border-b">
            <h3 className="font-bold text-gray-900 mb-3">Photos ({photoEntries.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photoEntries.map(({ slot, photo }) => (
                <PhotoThumbnail key={slot} photo={photo} label={slot} onClick={(src, label) => setImageOverlay({ src, label })} />
              ))}
            </div>
          </div>
        )}

        <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(item)
                .filter(([k]) => !HIDDEN_FIELDS.has(k))
                .map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium text-gray-700 capitalize align-top" style={{ width: '40%' }}>
                      {k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                    </td>
                    <td className="py-2 text-gray-900 break-words">{renderValue(v)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {imageOverlay && (
          <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-6" onClick={() => setImageOverlay(null)}>
            <button onClick={() => setImageOverlay(null)} className="absolute top-4 right-4 text-white p-2"><X className="w-6 h-6" /></button>
            <img src={imageOverlay.src} alt={imageOverlay.label} className="max-w-full max-h-full object-contain" />
          </div>
        )}
      </div>
    </div>
  );
};

const AdminInboxPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeKind, setActiveKind] = useState('contacts');
  const [counts, setCounts] = useState({});
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filter, setFilter] = useState('unread'); // all | unread | archived

  const fetchCounts = useCallback(async () => {
    try {
      const results = await Promise.all(
        KINDS.map((k) => axios.get(`${API}/admin/submissions/${k.key}/counts`).then((r) => r.data).catch(() => null))
      );
      const map = {};
      results.forEach((r) => {
        if (r) map[r.kind] = r;
      });
      setCounts(map);
    } catch (e) {
      console.error('counts error', e);
    }
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.q = search;
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;
      if (filter === 'unread') {
        params.read = false;
        params.archived = false;
      } else if (filter === 'archived') {
        params.archived = true;
      }
      const res = await axios.get(`${API}/admin/submissions/${activeKind}`, { params });
      setList(res.data);
    } catch (e) {
      console.error('list fetch error', e);
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [activeKind, search, fromDate, toDate, filter]);

  useEffect(() => {
    fetchCounts();
    fetchList();
  }, [fetchCounts, fetchList]);

  const openDetail = async (item) => {
    try {
      // Always fetch fresh detail for full photo base64
      const res = await axios.get(`${API}/admin/submissions/${activeKind}/${item.id}`);
      setSelected(res.data);
      // auto mark as read if unread
      if (!res.data.read) {
        await axios.patch(`${API}/admin/submissions/${activeKind}/${item.id}`, { read: true });
        fetchList();
        fetchCounts();
      }
    } catch (e) {
      console.error('detail error', e);
    }
  };

  const handleMarkRead = async (item, value) => {
    await axios.patch(`${API}/admin/submissions/${activeKind}/${item.id}`, { read: value });
    setSelected({ ...selected, read: value });
    fetchList();
    fetchCounts();
  };

  const handleToggleArchive = async (item, value) => {
    await axios.patch(`${API}/admin/submissions/${activeKind}/${item.id}`, { archived: value });
    setSelected({ ...selected, archived: value });
    fetchList();
    fetchCounts();
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this submission permanently?')) return;
    await axios.delete(`${API}/admin/submissions/${activeKind}/${item.id}`);
    setSelected(null);
    fetchList();
    fetchCounts();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-white hover:text-red-400 inline-flex items-center gap-2" data-testid="back-to-admin">
              <ArrowLeft className="w-5 h-5" /> Back
            </Link>
            <h1 className="text-2xl font-bold">Submissions Inbox</h1>
          </div>
          <div className="flex items-center gap-3">
            {user && <span className="text-xs text-gray-300 hidden sm:inline">{user.email}</span>}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              data-testid="logout-button"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-white rounded-t shadow-sm" data-testid="inbox-tabs">
          {KINDS.map((k) => {
            const c = counts[k.key];
            const unread = c?.unread || 0;
            const active = activeKind === k.key;
            return (
              <button
                key={k.key}
                onClick={() => { setActiveKind(k.key); setSelected(null); }}
                className={`relative px-5 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${active ? 'border-red-600 text-gray-900 font-semibold' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                data-testid={`tab-${k.key}`}
              >
                {k.label}
                {unread > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-white text-xs font-bold">{unread}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm rounded-b p-4 flex flex-wrap items-end gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500 text-sm"
                data-testid="search-input"
              />
            </div>
          </form>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded text-sm" data-testid="from-date" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded text-sm" data-testid="to-date" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Show</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded text-sm" data-testid="filter-select">
              <option value="unread">Unread</option>
              <option value="all">All</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="bg-white shadow-sm rounded mt-4" data-testid="submission-list">
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading...</div>
          ) : list.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No submissions found.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {list.map((item) => {
                const hasPhoto = (item.photos && Object.keys(item.photos).length > 0) || item.damagePhoto || item.insuranceCard;
                return (
                  <button
                    key={item.id}
                    onClick={() => openDetail(item)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-4 hover:bg-gray-50 ${!item.read ? 'bg-red-50/40' : ''}`}
                    data-testid={`row-${item.id}`}
                  >
                    <div className="flex-shrink-0 w-2 h-2 rounded-full" style={{ backgroundColor: item.read ? '#d1d5db' : '#dc2626' }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`truncate ${!item.read ? 'font-semibold' : ''} text-gray-900`}>{getDisplayName(item)}</p>
                        <p className="flex-shrink-0 text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-0.5">
                        <span className="truncate">{item.email || item.yourEmail || '—'}</span>
                        {item.phone && <span className="text-gray-400">·</span>}
                        {item.phone && <span>{item.phone}</span>}
                        {item.requestType && <span className="ml-auto px-2 py-0.5 text-xs bg-gray-200 rounded uppercase">{item.requestType}</span>}
                        {hasPhoto && <span className="inline-flex items-center gap-1 text-xs text-blue-600"><ImageIcon className="w-3 h-3" /> photo</span>}
                        {item.archived && <span className="text-xs text-gray-500 italic">archived</span>}
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DetailModal
        item={selected}
        kind={activeKind}
        onClose={() => setSelected(null)}
        onMarkRead={handleMarkRead}
        onToggleArchive={handleToggleArchive}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminInboxPage;
