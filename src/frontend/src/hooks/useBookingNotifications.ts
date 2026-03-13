import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { DabbaBooking } from "../types/local";
import { DabbaStatusEnum } from "../types/local";

type StatusMap = Record<string, string>;

function getNotificationContent(
  status: DabbaStatusEnum,
): { message: string; type: "info" | "success" | "error" } | null {
  switch (status) {
    case DabbaStatusEnum.pending:
      return {
        message: "Booking confirmed! Your dabba pickup has been scheduled.",
        type: "info",
      };
    case DabbaStatusEnum.pickedUp:
      return {
        message: "Your dabba has been picked up and is on the way!",
        type: "success",
      };
    case DabbaStatusEnum.inTransit:
      return {
        message: "Your delivery is arriving in a few minutes. Get ready!",
        type: "info",
      };
    case DabbaStatusEnum.delivered:
      return {
        message: "Your dabba has been delivered. Enjoy your meal!",
        type: "success",
      };
    case DabbaStatusEnum.cancelled:
      return { message: "Your booking has been cancelled.", type: "error" };
    default:
      return null;
  }
}

function fireBrowserNotification(title: string, body: string) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/icon.png" });
  }
}

let permissionRequested = false;

export function useBookingNotifications(bookings: DabbaBooking[]) {
  const previousStatuses = useRef<StatusMap>({});

  useEffect(() => {
    if (
      !permissionRequested &&
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      permissionRequested = true;
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (bookings.length === 0) return;

    const prev = previousStatuses.current;
    const next: StatusMap = {};

    for (const booking of bookings) {
      const currentStatus = booking.status as DabbaStatusEnum;
      next[booking.id] = currentStatus;

      const prevStatus = prev[booking.id];
      if (prevStatus !== undefined && prevStatus !== currentStatus) {
        const content = getNotificationContent(currentStatus);
        if (content) {
          const title = "Fresh Delivery Update";
          if (content.type === "success") {
            toast.success(content.message);
          } else if (content.type === "error") {
            toast.error(content.message);
          } else {
            toast.info(content.message);
          }
          fireBrowserNotification(title, content.message);
        }
      }
    }

    previousStatuses.current = next;
  }, [bookings]);
}
