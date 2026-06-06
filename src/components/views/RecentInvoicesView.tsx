import { useState } from 'react';
import { Invoice } from '../../types';
import { getThemeColors, ColorThemeName } from '../../utils/theme';
import {
  Search,
  Filter,
  Trash2,
  Copy,
  Edit2,
  Plus,
  ArrowUpDown,
  Download,
  AlertTriangle,
  Receipt,
  Eye,
  CheckCircle,
  FileCode
} from 'lucide-react';

interface RecentInvoicesViewProps {
  invoices: Invoice[];
  onEdit: (invoiceId: string) => void;
  onDelete: (invoiceId: string) => void;
  onDuplicate: (invoiceId: string) => void;
  onCreateNew: () => void;
  colorTheme?: ColorThemeName;
}

export default function RecentInvoicesView({
  invoices,
  onEdit,
  onDelete,
  onDuplicate,
  onCreateNew,
  colorTheme,
}: RecentInvoicesViewProps) {
  const colors = getThemeColors(colorTheme);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Draft'>('All');
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  // Filter & Search computation
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.clientEmail && invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteConfirm = () => {
    if (invoiceToDelete) {
      onDelete(invoiceToDelete);
      setInvoiceToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Manage Invoices
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Search, filter, edit, or copy previous bills and drafts.
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className={`inline-flex items-center gap-2 px-4 py-2 ${colors.primary} ${colors.primaryHover} text-white font-semibold text-xs rounded-xl shadow transition cursor-pointer`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Dynamic Search / Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 p-4 rounded-xl shadow-sm">
        {/* Search input */}
        <div className="relative sm:col-span-8 flex items-center">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by invoice ID, client name, or contact email..."
            className={`w-full pl-9 pr-3 py-2 border rounded-xl border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs font-semibold focus:ring-1 ${colors.focusRing} backdrop-blur-xs placeholder-neutral-400`}
          />
        </div>

        {/* Filter Selection */}
        <div className="sm:col-span-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400 uppercase shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className={`w-full px-3 py-2 border rounded-xl border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs font-semibold focus:ring-1 ${colors.focusRing} backdrop-blur-xs`}
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Paid Collection</option>
            <option value="Pending">Pending Collection</option>
            <option value="Draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Invoices List Display */}
      {filteredInvoices.length > 0 ? (
        <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-neutral-50/50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold font-mono tracking-widest">
                  <th className="py-3 px-4">Invoice Code</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs text-neutral-700 dark:text-neutral-300">
                {filteredInvoices.map(invoice => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-neutral-50/40 dark:hover:bg-neutral-850/20 transition duration-100"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-white">
                      #{invoice.invoiceNumber || 'INV-000'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {invoice.clientName || 'No Client Name'}
                      </div>
                      <div className="text-[10px] text-neutral-600 dark:text-neutral-400">
                        {invoice.clientEmail || 'No contact email'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 font-sans">
                      {invoice.issueDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-right text-neutral-900 dark:text-white">
                      {invoice.currency}
                      {invoice.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block mx-auto px-2.5 py-0.5 rounded-full font-bold text-[9px] font-mono tracking-wider uppercase ${
                          invoice.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : invoice.status === 'Pending'
                            ? colors.badge
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => onEdit(invoice.id)}
                          className={`p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:${colors.primaryText} hover:${colors.bgLight} dark:hover:${colors.bgLightDark} transition cursor-pointer`}
                          title="Edit Invoice"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Duplicate Button */}
                        <button
                          onClick={() => onDuplicate(invoice.id)}
                          className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition cursor-pointer"
                          title="Duplicate/Clone"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setInvoiceToDelete(invoice.id)}
                          className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl p-12 text-center text-neutral-400 dark:text-neutral-500 italic text-sm shadow-sm">
          <Receipt className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
          <p className="font-semibold">No invoices fit your criteria.</p>
          <p className="text-xs text-neutral-400 mt-1">Try a different search keyword or edit an existing filter.</p>
        </div>
      )}

      {/* Real deletion confirmation Modal */}
      {invoiceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-md">
          <div className="bg-white/75 dark:bg-neutral-900/75 border border-white/20 dark:border-neutral-800/40 backdrop-blur-lg rounded-2xl p-6 max-w-sm w-full shadow-2xl relative z-10">
            <div className="flex items-center gap-3 text-red-650 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="font-bold text-neutral-900 dark:text-white">
                Delete Invoice Draft?
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Are you absolutely sure you want to delete this invoice? This command is permanent and the invoice data cannot be restored.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setInvoiceToDelete(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition cursor-pointer"
              >
                No, Keep it
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
