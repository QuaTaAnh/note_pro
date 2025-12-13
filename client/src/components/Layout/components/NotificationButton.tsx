import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateAccessRequestStatusMutation } from "@/graphql/mutations/__generated__/access-request.generated";
import {
  useCreateNotificationMutation,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/graphql/mutations/__generated__/notification.generated";
import { useNotificationSubscriptionSubscription } from "@/graphql/queries/__generated__/notification.generated";
import { useUserId } from "@/hooks/useAuth";
import { showToast } from "@/lib/toast";
import { Notification } from "@/types/app";
import { AccessRequestStatus } from "@/types/types";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useState } from "react";
import { FaRegBell } from "react-icons/fa6";
import { FiCheck, FiX } from "react-icons/fi";

export const NotificationButton = () => {
  const userId = useUserId();
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(
    null,
  );

  const { data: notificationsData, loading } =
    useNotificationSubscriptionSubscription({
      variables: { userId: userId || "" },
      skip: !userId,
      fetchPolicy: "network-only",
      ignoreResults: false,
    });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const [updateAccessRequest] = useUpdateAccessRequestStatusMutation({
    // Refetch access request queries to update UI across all components
    refetchQueries: ["GetAccessRequestByDocument"],
    awaitRefetchQueries: true,
  });
  const [createNotification] = useCreateNotificationMutation();

  const notifications = useMemo(
    () => notificationsData?.notifications || [],
    [notificationsData],
  );

  const unreadCountValue = useMemo(() => {
    const count = notifications.filter(
      (notification) => !notification.is_read,
    ).length;
    return count;
  }, [notifications]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead({
        variables: { id: notification.id },
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    await markAllAsRead({
      variables: { userId },
    });
  };

  const handleApprove = async (notification: Notification) => {
    const data = notification.data;
    if (!data?.document_id || !data?.requester_id) return;

    setProcessingRequestId(notification.id);
    try {
      const requestId = data.request_id || data.access_request_id;

      if (requestId) {
        await updateAccessRequest({
          variables: {
            id: requestId,
            status: AccessRequestStatus.APPROVED,
            updated_at: new Date().toISOString(),
          },
        });
      }

      await createNotification({
        variables: {
          input: {
            user_id: data.requester_id,
            type: "access_granted",
            title: "Access granted",
            message: `Your access request to "${
              data.document_title || "document"
            }" has been approved`,
            data: {
              document_id: data.document_id,
            },
          },
        },
      });

      await markAsRead({
        variables: { id: notification.id },
      });

      showToast.success("Access request approved");
    } catch (error) {
      console.error("Failed to approve:", error);
      showToast.error("Failed to approve request");
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleReject = async (notification: (typeof notifications)[0]) => {
    const data = notification.data as any;
    if (!data?.document_id || !data?.requester_id) return;

    setProcessingRequestId(notification.id);
    try {
      const requestId = data.request_id || data.access_request_id;

      if (requestId) {
        await updateAccessRequest({
          variables: {
            id: requestId,
            status: AccessRequestStatus.REJECTED,
            updated_at: new Date().toISOString(),
          },
        });
      }

      await createNotification({
        variables: {
          input: {
            user_id: data.requester_id,
            type: "access_denied",
            title: "Access denied",
            message: `Your access request to "${
              data.document_title || "document"
            }" has been denied`,
            data: {
              document_id: data.document_id,
            },
          },
        },
      });

      await markAsRead({
        variables: { id: notification.id },
      });

      showToast.success("Access request rejected");
    } catch (error) {
      console.error("Failed to reject:", error);
      showToast.error("Failed to reject request");
    } finally {
      setProcessingRequestId(null);
    }
  };

  if (loading && !notificationsData) {
    return (
      <div className="relative">
        <Button variant="ghost" size="icon" className="w-6 h-6">
          <FaRegBell className="h-4 w-4 animate-pulse" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-6 h-6 relative">
            <FaRegBell className="h-4 w-4" />
            {unreadCountValue > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCountValue > 9 ? "9+" : unreadCountValue}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-96 p-2 max-h-[500px] overflow-y-auto"
          align="end"
        >
          <DropdownMenuLabel>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Notifications</p>
              {unreadCountValue > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {loading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No notifications yet
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => {
                const isAccessRequest = notification.type === "access_request";
                const data = notification.data;
                const isProcessing = processingRequestId === notification.id;

                return (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      !notification.is_read
                        ? "bg-blue-50 dark:bg-blue-950/20"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex items-start justify-between gap-2 ${
                        !isAccessRequest
                          ? "cursor-pointer hover:opacity-80"
                          : ""
                      }`}
                      onClick={() =>
                        !isAccessRequest &&
                        handleNotificationClick(notification)
                      }
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {notification.title}
                        </p>
                        {notification.message && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        )}
                        {isAccessRequest && data && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                            Permission: {data.permission_type || "read"}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.created_at &&
                            formatDistanceToNow(
                              new Date(notification.created_at),
                              {
                                addSuffix: true,
                              },
                            )}
                        </p>
                      </div>
                      {!notification.is_read && !isAccessRequest && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                      )}
                    </div>

                    {isAccessRequest && data && (
                      <div className="flex gap-2 mt-3 pt-3 border-t">
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-2 flex-1"
                          onClick={() => handleApprove(notification)}
                          disabled={isProcessing}
                        >
                          <FiCheck className="h-4 w-4" />
                          {isProcessing ? "Processing..." : "Approve"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 flex-1"
                          onClick={() => handleReject(notification)}
                          disabled={isProcessing}
                        >
                          <FiX className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
