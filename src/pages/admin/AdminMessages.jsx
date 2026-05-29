import { useEffect, useState } from 'react';
import { FiMail, FiMessageSquare } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { Loader } from '../../components/common/Loader';
import { useAdminPanel } from '../../context/AdminPanelContext';
import { getAllSupportMessages } from '../../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentSearch } = useAdminPanel();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAllSupportMessages();
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const keyword = currentSearch.trim().toLowerCase();
  const filtered = messages.filter((item) => {
    if (!keyword) return true;

    return [item.name, item.email, item.subject, item.message]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(keyword);
  });

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in">
        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <FiMessageSquare className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">No messages found</h2>
            <p className="mt-1 text-sm text-gray-500">Customer contact messages will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((item) => (
              <div key={item._id} className="card p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                        <FiMail className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">{item.name}</h2>
                        <p className="text-sm text-gray-500">{item.email}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-primary-600">{item.subject}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">{item.message}</p>
                  </div>

                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
                      {item.status}
                    </span>
                    <p className="text-xs text-gray-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : '-'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
