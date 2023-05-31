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
}

export default function CustomPopover({
  isNotifications,
  avatarName,
  children,
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
          <Avatar name={avatarName} cursor="pointer" />
        )}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody px="1rem" py="0.75rem">
          {children}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
