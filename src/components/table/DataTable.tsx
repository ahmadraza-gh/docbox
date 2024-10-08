"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FileType } from "@/typings/filetype";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useAppStore } from "@/zustand/useAppStore";
import { DeleteModal } from "../DeleteModal";
import { RenameModal } from "../RenameModal";
import { ShowParsedDataModal } from "../ShowParsedDataModal";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const {
    setFileId,
    setFilename,
    setTags,
    setIsDeleteModalOpen,
    setIsRenameModalOpen,
    setUnstructuredFileData,
    setIsShowParseDataModelOpen,
    isShowParseDataModelOpen,
    setFileSummary,
  } = useAppStore();
  const openDeleteModal = (fileId: string) => {
    setFileId(fileId);
    setIsDeleteModalOpen(true);
  };
  const openParseDataViewModal = (
    docId: string,
    filedata: string,
    summary: string
  ) => {
    setUnstructuredFileData(filedata);
    setFileSummary({ docId, summary });
    setIsShowParseDataModelOpen(true);
  };
  const openRenameModal = (fileId: string, filename: string, tags: string[] = []) => {
    setFileId(fileId);
    setFilename(filename);
    setTags(tags);
    setIsRenameModalOpen(true);
  };
  return (
    <div className="rounded-lg border border-gray-200 shadow-md overflow-hidden">
      {isShowParseDataModelOpen && <ShowParsedDataModal />}

      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-white"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="transition-shadow"
                data-state={row.getIsSelected() && "selected"}
              >
                <DeleteModal />
                <RenameModal />
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-2 px-4 text-gray-600 dark:text-white"
                  >
                    {cell.column.id === "timestamp" ? (
                      <div className="flex flex-col">
                        <div className="text-sm font-medium">
                          {(cell.getValue() as Date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-white">
                          {(cell.getValue() as Date).toLocaleTimeString()}
                        </div>
                      </div>
                    ) : cell.column.id === "filename" ? (
                      <div
                        onClick={() =>
                          openRenameModal(
                            (row.original as FileType).id,
                            (row.original as FileType).filename,
                            (row.original as FileType).tags

                          )
                        }
                        className="flex items-center text-blue-600 hover:underline cursor-pointer gap-2"
                      >
                        <div>{cell.getValue() as string}</div>
                        <PencilIcon size={15} className="ml-2" />
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
                <TableCell className="flex space-x-2 py-2 px-4 justify-end">
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      openParseDataViewModal(
                        (row.original as FileType).id,
                        (row.original as FileType).unstructuredFile,
                        (row.original as FileType).summary
                      );
                    }}
                    className="text-blue-500 hover:bg-blue-100"
                  >
                    <EyeIcon size={20} />
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() =>
                      openDeleteModal((row.original as FileType).id)
                    }
                    className="text-red-500 hover:bg-red-100"
                  >
                    <TrashIcon size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-gray-600"
              >
                No files found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
