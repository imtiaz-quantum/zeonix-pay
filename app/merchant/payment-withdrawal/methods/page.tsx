import AddMethod from "@/components/merchant/payment-method/add-method";
import { getPaymentMethodList } from "@/lib/api/merchant/payment-method";


export default async function Page() {

    const paymentMethodListPromise = getPaymentMethodList()

  return (
    <AddMethod paymentMethodListPromise={paymentMethodListPromise}/>
  );
}
