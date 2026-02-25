import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MapPin } from "lucide-react";
import { userService } from "../../api/userService";
import { getErrorMessage } from "../../lib/utils";
import { SkeletonLine } from "../../components/ui/Skeleton";

const defaultValues = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "India",
  isDefault: false,
};

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({ defaultValues });

  const { data: addressData, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: userService.getAddresses,
  });

  const addresses = addressData?.addresses || [];

  const addAddressMutation = useMutation({
    mutationFn: userService.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      reset(defaultValues);
      toast.success("Address added");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Addresses</h1>
        <p className="text-sm text-slate-500 mt-1">Use your saved addresses at checkout.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Add New Address</h2>
        <form
          onSubmit={handleSubmit((formData) => addAddressMutation.mutate(formData))}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <input {...register("street", { required: true })} placeholder="Street" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input {...register("city", { required: true })} placeholder="City" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input {...register("state", { required: true })} placeholder="State" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input {...register("zip", { required: true })} placeholder="Zip code" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input {...register("country", { required: true })} placeholder="Country" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" {...register("isDefault")} /> Default address
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={addAddressMutation.isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {addAddressMutation.isPending ? "Saving..." : "Add Address"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-semibold text-slate-800 mb-3">Saved Addresses</h2>

        {isLoading ? (
          <div className="space-y-2">
            <SkeletonLine className="h-18 w-full" />
            <SkeletonLine className="h-18 w-full" />
          </div>
        ) : addresses.length === 0 ? (
          <p className="text-sm text-slate-500">No addresses saved yet.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-800">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  {addr.street}
                </p>
                <p className="text-sm text-slate-500">
                  {addr.city}, {addr.state} {addr.postalCode || addr.zip}
                </p>
                <p className="text-sm text-slate-500">{addr.country}</p>
                {addr.isDefault && (
                  <span className="text-xs text-indigo-600 font-medium">Default</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
