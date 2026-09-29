import React, { useState } from 'react';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  Star,
  CheckCircle2,
  Clock,
  Briefcase,
} from 'lucide-react';
import type { AdminService } from '../types';
import { ServiceEditModal, SERVICE_ICONS } from './ServiceEditModal';

interface ServicesViewProps {
  services: AdminService[];
  onUpdateServices: (services: AdminService[]) => void;
  onShowToast: (message: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  onUpdateServices,
  onShowToast,
}) => {
  const [editingService, setEditingService] = useState<AdminService | null | undefined>(undefined);

  const sortedServices = [...services].sort((a, b) => a.order - b.order);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...sortedServices];
    const prevOrder = items[index - 1].order;
    items[index - 1].order = items[index].order;
    items[index].order = prevOrder;
    onUpdateServices(items);
    onShowToast('Service catalog order updated.');
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedServices.length - 1) return;
    const items = [...sortedServices];
    const nextOrder = items[index + 1].order;
    items[index + 1].order = items[index].order;
    items[index].order = nextOrder;
    onUpdateServices(items);
    onShowToast('Service catalog order updated.');
  };

  const handleToggleFeatured = (id: string) => {
    const updated = services.map((s) => (s.id === id ? { ...s, featured: !s.featured } : s));
    onUpdateServices(updated);
    onShowToast('Service feature status updated.');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service offering?')) {
      const updated = services.filter((s) => s.id !== id);
      onUpdateServices(updated);
      onShowToast('Service deleted successfully.');
    }
  };

  const handleSaveService = (savedService: AdminService) => {
    const exists = services.some((s) => s.id === savedService.id);
    let updated: AdminService[];
    if (exists) {
      updated = services.map((s) => (s.id === savedService.id ? savedService : s));
      onShowToast('Service updated successfully.');
    } else {
      updated = [...services, savedService];
      onShowToast('New service offering published.');
    }
    onUpdateServices(updated);
    setEditingService(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            Services Management CMS
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Define and publish client service offerings, technical scopes, and deliverables.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditingService(null)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 w-16 text-center">Order</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-4 py-3">Features</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3 text-center">Featured</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {sortedServices.map((service, idx) => {
                const IconComp = SERVICE_ICONS[service.icon] || Briefcase;
                return (
                  <tr
                    key={service.id}
                    className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-mono text-neutral-500 font-bold w-4 text-center">
                          {service.order}
                        </span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveUp(idx)}
                            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === sortedServices.length - 1}
                            onClick={() => handleMoveDown(idx)}
                            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 max-w-sm sm:max-w-md">
                          <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {service.title}
                          </div>
                          <div className="text-[11px] text-neutral-500 truncate">
                            {service.shortSummary}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        {service.features.length} features
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          service.visibility === 'Published'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {service.visibility === 'Published' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{service.visibility}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(service.id)}
                        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                        title={service.featured ? 'Featured on homepage' : 'Not featured'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            service.featured
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-neutral-300 dark:text-neutral-600'
                          }`}
                        />
                      </button>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingService(service)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                          title="Edit service"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(service.id)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Delete service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingService !== undefined && (
        <ServiceEditModal
          service={editingService}
          onSave={handleSaveService}
          onClose={() => setEditingService(undefined)}
        />
      )}
    </div>
  );
};
