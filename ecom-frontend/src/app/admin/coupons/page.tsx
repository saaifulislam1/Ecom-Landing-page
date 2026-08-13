import { FiPlus } from "react-icons/fi";
import { getAdminCoupons } from "@/lib/api";
import { AdminButtonLink } from "@/components/admin/ui/AdminButton";
import { CouponAdminClient } from "@/components/admin/coupon/CouponAdminClient";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export default async function AdminCouponsPage() {
  const adminCoupons = await getAdminCoupons();
  return (
    <>
      <PageHeader title="Coupons" description="Create discounts, free shipping campaigns, and limited-use offers." actions={<AdminButtonLink href="#add-coupon"><FiPlus /> Add coupon</AdminButtonLink>} />
      <CouponAdminClient coupons={adminCoupons} />
    </>
  );
}
