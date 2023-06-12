import {
  Avatar,
  Button,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { NotificationsNone } from "@mui/icons-material";
import { ReactNode } from "react";

interface ICustomPopoverProps {
  isNotifications: boolean;
  avatarName?: string;
  children: ReactNode;
  settingData?: ReactNode;
  avatarUrl?: string;
}

export default function CustomPopover({
  isNotifications,
  avatarName,
  children,
  avatarUrl,
}: ICustomPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger>
        {isNotifications ? (
          <IconButton
            aria-label="Notifications"
            icon={<NotificationsNone />}
            variant="ghost"
          />
        ) : (
          //   notification query onclick
          <Avatar name={avatarName} src={avatarUrl} cursor="pointer" />
        )}
      </PopoverTrigger>
      <PopoverContent w="100%" p="0">
        <PopoverArrow />
        <PopoverBody p="0">{children}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
