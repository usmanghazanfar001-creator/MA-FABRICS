"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminProductSchema, type AdminProductInput } from "@/lib/validations/admin-product";
import { createAdminProduct, updateAdminProduct } from "@/lib/services/admin-products";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";

interface Options {
  categories: { id: string; name: string }[];
  collections: { id: string; name: string }[];
  colors: { id: string; name: string; hex: string }[];
}

export function ProductForm({
  options,
  defaultValues,
  productId,
}: {
  options: Options;
  defaultValues?: Partial<AdminProductInput>;
  productId?: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminProductInput>({
    resolver: zodResolver(adminProductSchema),
    defaultValues: {
      season: "ALL_SEASON",
      colorIds: [],
      imageUrls: [],
      isFeatured: false,
      isNewArrival: false,
      isPublished: false,
      stockMeters: 0,
      ...defaultValues,
    },
  });

  const selectedColors = watch("colorIds") ?? [];
  const imageUrls = watch("imageUrls") ?? [];

  async function onSubmit(data: AdminProductInput) {
    setServerError(null);
    const result = productId ? await updateAdminProduct(productId, data) : await createAdminProduct(data);
    if (result.success) {
      router.push("/admin/products");
    } else {
      setServerError(result.error ?? "Something went wrong.");
    }
  }

  function toggleColor(id: string) {
    setValue("colorIds", selectedColors.includes(id) ? selectedColors.filter((c) => c !== id) : [...selectedColors, id]);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Name" error={errors.name?.message} {...register("name")} />
        <TextField label="Slug" error={errors.slug?.message} {...register("slug")} />
        <TextField label="SKU" error={errors.sku?.message} {...register("sku")} />
        <TextField label="Price (PKR)" type="number" error={errors.price?.message} {...register("price")} />
        <TextField label="Compare-at price" type="number" error={errors.compareAtPrice?.message} {...register("compareAtPrice")} />
        <TextField label="Stock (meters)" type="number" error={errors.stockMeters?.message} {...register("stockMeters")} />
      </div>

      <TextArea label="Short description" {...register("shortDescription")} />
      <TextArea label="Description" rows={5} error={errors.description?.message} {...register("description")} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Select label="Category" {...register("categoryId")}>
          <option value="">None</option>
          {options.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Select label="Collection" {...register("collectionId")}>
          <option value="">None</option>
          {options.collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <TextField label="Fabric type" {...register("fabricType")} />
        <TextField label="Texture" {...register("texture")} />
        <Select label="Season" {...register("season")}>
          <option value="ALL_SEASON">All season</option>
          <option value="SUMMER">Summer</option>
          <option value="WINTER">Winter</option>
        </Select>
        <TextField label="Recommended use" {...register("recommendedUse")} />
      </div>

      <div>
        <p className="mb-2 text-sm text-navy">Product images</p>
        <ImageUploader value={imageUrls} onChange={(urls) => setValue("imageUrls", urls)} folder="products" />
      </div>

      <div>
        <p className="mb-2 text-sm text-navy">Colors</p>
        <div className="flex flex-wrap gap-2">
          {options.colors.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => toggleColor(c.id)}
              className={`h-8 w-8 rounded-full border-2 ${selectedColors.includes(c.id) ? "border-gold" : "border-transparent"}`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <Checkbox label="Published" {...register("isPublished")} />
        <Checkbox label="Featured" {...register("isFeatured")} />
        <Checkbox label="New arrival" {...register("isNewArrival")} />
      </div>

      {serverError && <p className="text-sm text-red-700">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : productId ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}

function TextField({ label, error, ...props }: any) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-navy">{label}</label>
      <input {...props} className="w-full border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold" />
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

function TextArea({ label, error, rows = 3, ...props }: any) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-navy">{label}</label>
      <textarea rows={rows} {...props} className="w-full border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold" />
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

function Select({ label, children, ...props }: any) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-navy">{label}</label>
      <select {...props} className="w-full border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold">
        {children}
      </select>
    </div>
  );
}

function Checkbox({ label, ...props }: any) {
  return (
    <label className="flex items-center gap-2 text-sm text-navy">
      <input type="checkbox" {...props} className="h-4 w-4 accent-gold" />
      {label}
    </label>
  );
}
