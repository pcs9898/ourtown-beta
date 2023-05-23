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

interface ICustomPopoverProps {
  isNotifications: boolean;
}

export default function CustomPopover({
  isNotifications,
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
          <Avatar name="Chansoo Park" />
        )}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody px="1rem" py="0.75rem">
          {isNotifications ? "notification data" : "setting data"}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
