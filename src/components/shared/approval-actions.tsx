"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, Send, X } from "lucide-react";

type Props = {
  showSubmit?: boolean;
  showApprove?: boolean;
  showRevise?: boolean;
  onSubmit?: (note?: string) => void;
  onApprove?: (note?: string) => void;
  onRevise?: (reason: string) => void;
};

type ActionDialog = "submit" | "approve" | "revise";

export function ApprovalActions({
  showSubmit,
  showApprove,
  showRevise,
  onSubmit,
  onApprove,
  onRevise,
}: Props) {
  const [dialog, setDialog] = useState<ActionDialog | null>(null);
  const [note, setNote] = useState("");

  const closeDialog = () => {
    setDialog(null);
    setNote("");
  };

  const handleConfirm = () => {
    const trimmedNote = note.trim();

    if (dialog === "submit") {
      onSubmit?.(trimmedNote || undefined);
      closeDialog();
      return;
    }

    if (dialog === "approve") {
      onApprove?.(trimmedNote || undefined);
      closeDialog();
      return;
    }

    if (dialog === "revise" && trimmedNote) {
      onRevise?.(trimmedNote);
      closeDialog();
    }
  };

  const dialogTitle =
    dialog === "submit"
      ? "ยืนยันส่งขออนุมัติ"
      : dialog === "approve"
        ? "ยืนยันการอนุมัติ"
        : "ส่งกลับแก้ไข";
  const dialogDescription =
    dialog === "submit"
      ? "เมื่อยืนยันแล้ว รายการจะเข้าสู่คิวพิจารณาอนุมัติ"
      : dialog === "approve"
        ? "เมื่อยืนยันแล้ว สถานะจะเดินหน้าตามเวิร์กโฟลว์"
        : "กรุณาระบุเหตุผลที่ส่งกลับแก้ไข";
  const textareaPlaceholder =
    dialog === "revise" ? "ระบุเหตุผล..." : "หมายเหตุ (ถ้ามี)";
  const confirmLabel =
    dialog === "submit"
      ? "ยืนยันส่ง"
      : dialog === "approve"
        ? "ยืนยันอนุมัติ"
        : "ยืนยันส่งกลับ";
  const confirmClassName =
    dialog === "submit"
      ? "bg-purple-700 hover:bg-purple-800"
      : dialog === "approve"
        ? "bg-green-600 hover:bg-green-700"
        : "bg-red-600 hover:bg-red-700";

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {showSubmit && (
          <Button
            onClick={() => setDialog("submit")}
            className="gap-1.5 bg-purple-700 hover:bg-purple-800"
          >
            <Send className="size-3.5" />
            ส่งอนุมัติ
          </Button>
        )}
        {showApprove && (
          <Button
            onClick={() => setDialog("approve")}
            className="gap-1.5 bg-green-600 hover:bg-green-700"
          >
            <Check className="size-3.5" />
            อนุมัติ
          </Button>
        )}
        {showRevise && (
          <Button
            variant="outline"
            onClick={() => setDialog("revise")}
            className="gap-1.5 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            <X className="size-3.5" />
            ส่งกลับแก้ไข
          </Button>
        )}
      </div>

      <Dialog
        open={dialog !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={textareaPlaceholder}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={dialog === "revise" && !note.trim()}
              className={confirmClassName}
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
