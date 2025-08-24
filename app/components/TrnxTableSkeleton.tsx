import { CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentTransactionSkeletonProps {
  headers: string[];
}

const RecentTransactionSkeleton = ({
  headers,
}: RecentTransactionSkeletonProps) => (
  <CardContent className="px-3 md:px-4">
    <div className="rounded-lg border bg-white shadow-md overflow-x-auto">
      <Table className="min-w-full text-sm">
        <TableHeader className="bg-customViolet sticky top-0 z-10">
          <TableRow className="hover:bg-customViolet">
            {headers.map((header: string, idx: number) => (
              <TableHead key={idx} className="text-white py-3">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 5 }).map((_, rowIndex: number) => (
            <TableRow key={rowIndex}>
              {headers.map((_, colIndex: number) => (
                <TableCell key={colIndex} className="py-3">
                  <div className="h-4 bg-gray-200 rounded-full animate-pulse w-full"></div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </CardContent>
);

export default RecentTransactionSkeleton;
