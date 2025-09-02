import AddMethod from "@/app/components/merchant/payment-method/add-method";
import { getPaymentMethodList } from "@/app/lib/api/merchant/payment-method";


export default async function Page() {

  const res = await getPaymentMethodList();
    const paymentMethodListPromise = getPaymentMethodList()

  return (
    <AddMethod paymentMethodListPromise={paymentMethodListPromise}/>
  );
}
