import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DepositTableSkeleton = () => {
  interface SkeletonPlaceholderProps {
    width: string;
    height: string;
    className?: string;
  }

  const SkeletonPlaceholder: React.FC<SkeletonPlaceholderProps> = ({
    width,
    height,
    className = "",
  }) => (
    <div
      className={`animate-pulse bg-gray-200 rounded-md ${className}`}
      style={{ width: width, height: height }}
    />
  );

  const skeletonRows = Array.from({ length: 8 });

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center py-4 gap-2">
        <SkeletonPlaceholder width="200px" height="40px" className="flex-1" />
        <SkeletonPlaceholder width="200px" height="40px" className="flex-1" />
        <SkeletonPlaceholder width="100px" height="40px" />
        <SkeletonPlaceholder width="100px" height="40px" />
        <SkeletonPlaceholder width="100px" height="40px" />
        <SkeletonPlaceholder width="100px" height="40px" className="ml-auto" />
      </div>

      {/* Main table area */}
      <div className="rounded-md border overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-customViolet">
            <TableRow>
              <TableHead className="text-white">
                <SkeletonPlaceholder width="80px" height="16px" />
              </TableHead>
              <TableHead className="text-white">
                <SkeletonPlaceholder width="120px" height="16px" />
              </TableHead>
              <TableHead className="text-white">
                <SkeletonPlaceholder width="100px" height="16px" />
              </TableHead>
              <TableHead className="text-white">
                <SkeletonPlaceholder width="60px" height="16px" />
              </TableHead>
              <TableHead className="text-white">
                <SkeletonPlaceholder width="90px" height="16px" />
              </TableHead>
              <TableHead className="text-white">
                <SkeletonPlaceholder width="80px" height="16px" />
              </TableHead>
              <TableHead className="text-white">
                <SkeletonPlaceholder width="80px" height="16px" />
              </TableHead>
              <TableHead className="text-white">
                <SkeletonPlaceholder width="70px" height="16px" />
              </TableHead>
              <TableHead className="text-white">
                <SkeletonPlaceholder width="50px" height="16px" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <SkeletonPlaceholder width="100px" height="16px" />
                </TableCell>
                <TableCell>
                  <SkeletonPlaceholder width="150px" height="16px" />
                </TableCell>
                <TableCell>
                  <SkeletonPlaceholder width="120px" height="16px" />
                </TableCell>
                <TableCell>
                  <SkeletonPlaceholder width="80px" height="16px" />
                </TableCell>
                <TableCell>
                  <SkeletonPlaceholder width="110px" height="16px" />
                </TableCell>
                <TableCell>
                  <SkeletonPlaceholder width="100px" height="16px" />
                </TableCell>
                <TableCell>
                  <SkeletonPlaceholder width="100px" height="16px" />
                </TableCell>
                <TableCell>
                  <SkeletonPlaceholder width="90px" height="16px" />
                </TableCell>
                <TableCell>
                  <SkeletonPlaceholder width="70px" height="16px" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bottom pagination section */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <SkeletonPlaceholder width="80px" height="36px" />
          <SkeletonPlaceholder width="60px" height="36px" />
        </div>
      </div>
    </div>
  );
};

export default DepositTableSkeleton;
