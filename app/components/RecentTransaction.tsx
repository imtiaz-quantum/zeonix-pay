import React, { use } from 'react'
import {CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

// Define the Transaction type with more specific fields
type Transaction = {
  id: number;
  store_name: string;
  object_id: number;
  amount: string;            // "50.00"
  method: string;            // "bkash"
  status: "success" | "pending" | "failed" | string;
  created_at: string;        // ISO e.g. "2025-08-13T10:24:05.866102Z"
  trx_id: string;            // "CHD10N90H7"
  trx_uuid: string;
  tran_type: "credit" | "debit" | string;
  wallet: number;
  merchant: number;
  content_type: number;
};

interface ApiResponse {
  status: boolean;
  count: number;
  data: Transaction[];
}

type DynamicTableProps = {
  headers: string[];
  walletTrnxPromise: Promise<ApiResponse>;
};

const TZ = "Asia/Dhaka";
const CURRENCY = "BDT"; // change to "BDT" if you prefer Taka

function formatAmount(raw: string | number) {
  const n = typeof raw === "string" ? parseFloat(raw) : raw;
  if (Number.isNaN(n)) return String(raw ?? "");
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CURRENCY,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return Number(n).toFixed(2);
  }
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}



function statusClasses(status: string) {
  const s = status.toLowerCase();
  if (s === "success" || s === "paid") return "bg-green-600 text-white";
  if (s === "pending" || s === "processing") return "bg-yellow-500 text-white";
  return "bg-red-600 text-white";
}

const RecentTransaction: React.FC<DynamicTableProps> = ({ headers, walletTrnxPromise }) => {

  const {data} = use(walletTrnxPromise);
  console.log(data);
  
  return (

    <CardContent className='px-3 md:px-4'>
      <div className="rounded-lg border bg-white shadow-md overflow-x-auto">
        <Table className="min-w-full text-sm">
          <TableHeader className="bg-customViolet sticky top-0 z-10">
            <TableRow className="hover:bg-customViolet">
              {headers.map((header, idx) => (
                <TableHead key={idx} className='text-white py-3'>{header} </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((t, idx) => (
                <TableRow
                  key={`${t.trx_uuid}-${idx}`}
                  className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}
                >
                  <TableCell className="">{t.id}</TableCell>
                  <TableCell className="">{t.store_name}</TableCell>
                  <TableCell className="font-medium">{t.trx_id}</TableCell>
                  <TableCell className="capitalize">{t.method}</TableCell>
                  <TableCell className=" capitalize">{t.tran_type}</TableCell>
                  <TableCell className="">{formatDate(t.created_at)}</TableCell>
                  <TableCell>
                    <Badge className={statusClasses(t.status)}>
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatAmount(t.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>

  )
}

export default RecentTransaction
