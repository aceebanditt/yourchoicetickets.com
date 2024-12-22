import { CategoryNav } from "@/components/layout/category-nav";

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <CategoryNav />
      {children}
    </div>
  );
}