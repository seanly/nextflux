import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react"; // Re-use styles across other submenus.
import { audioState } from "@/stores/audioStore.js";
import { useStore } from "@nanostores/react";
import { CircleGauge } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SpeedMenu() {
  const { playbackRate } = useStore(audioState);
  const options = ["0.5", "0.7", "0.9", "1.0", "1.3", "1.5", "2.0"];
  const { t } = useTranslation();
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant={playbackRate === "1.0" ? "light" : "flat"}
          color={playbackRate === "1.0" ? "default" : "primary"}
          size="sm"
          radius="full"
        >
          {playbackRate === "1.0" ? (
            <CircleGauge className="size-4 text-default-500" />
          ) : (
            playbackRate
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Single selection example"
        selectedKeys={new Set([playbackRate.toString()])}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(values) =>
          audioState.setKey("playbackRate", values.currentKey)
        }
      >
        <DropdownSection
          title={t("player.Speed")}
          classNames={{ base: "mb-0" }}
        >
          {options.map((option) => (
            <DropdownItem key={option}>
              {option === "1.0" ? (
                t("common.normal")
              ) : (
                <span>
                  {option}
                  <span className="text-default-400">x</span>
                </span>
              )}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
