import AddMethod from "@/app/components/merchant/payment-method/add-method";
import { getPaymentMethodList } from "@/app/lib/api/merchant/payment-method";


export default async function Page() {

  const res = await getPaymentMethodList();

  return (
    <AddMethod data={res?.data ?? []}/>
  );
}
