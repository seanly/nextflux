import { Controls, MediaPlayer, MediaProvider } from "@vidstack/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { audioState, resetAudio } from "@/stores/audioStore.js";
import { useStore } from "@nanostores/react";
import * as Buttons from "./shared/buttons";
import { Button, Card, Image, Tooltip } from "@heroui/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils.js";
import { Time } from "./shared/sliders.jsx";
import { X, Minimize2, Maximize2 } from "lucide-react";
import cover from "@/assets/cover.jpg";
import SpeedSubmenu from "@/components/ArticleView/components/shared/speed.jsx";
import { useTranslation } from "react-i18next";

const transitionConfig = {
  duration: 0.4,
  type: "spring",
  bounce: 0,
  ease: "linear",
};

export default function AudioPlayer({ source }) {
  const location = useLocation();
  const [time, setTime] = useState(0);
  const [expand, setExpand] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { title, artist, artwork, playbackRate, paused, currentTime } = useStore(audioState);
  const { t } = useTranslation();

  // 监听 currentTime 变化
  useEffect(() => {
    if (currentTime !== undefined) {
      setTime(currentTime);
    }
  }, [currentTime]);

  useEffect(() => {
    const hash = location.hash;
    const timeMatch = hash.match(/#t=(?:(\d+):)?(\d+):(\d+)/);

    if (timeMatch) {
      const [, hours, minutes, seconds] = timeMatch;
      const totalSeconds =
        (parseInt(hours) || 0) * 3600 +
        parseInt(minutes) * 60 +
        parseInt(seconds);

      if (!isNaN(totalSeconds)) {
        setTime(totalSeconds);
      }
    }
  }, [location.hash]);

  const url = source.url;
  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isHidden ? 0 : 1, y: isHidden ? 100 : 0 }}
        transition={transitionConfig}
        className={cn(
          "fixed bottom-4 right-4 mb-2 px-2 max-w-80 w-full z-50",
          isHidden && "pointer-events-none"
        )}
      >
        <MediaPlayer
          paused={paused}
          autoPlay={true}
          keyDisabled
          onPlay={() => {
            audioState.setKey("loading", false);
            audioState.setKey("paused", false);
          }}
          onPause={() => audioState.setKey("paused", true)}
          onWaiting={() => audioState.setKey("loading", true)}
          onPlaying={() => audioState.setKey("loading", false)}
          src={url}
          viewType="audio"
          currentTime={time}
          playbackRate={playbackRate}
          title={title}
          artist={artist}
          artwork={[
            {
              src: artwork || cover,
            },
          ]}
        >
          <MediaProvider />
          <Controls.Root className="w-full">
            <Controls.Group>
              <motion.div
                layout
                transition={transitionConfig}
                className={cn(
                  "audio-player-controls flex items-center shadow-custom w-full bg-content1/80 backdrop-blur-lg dark:bg-content2/80 gap-2",
                  expand ? "flex-col p-4" : "p-2",
                )}
                style={{ borderRadius: "12px" }}
              >
                <motion.div
                  layout
                  transition={transitionConfig}
                  className="flex items-center gap-2 w-full"
                >
                  <Card
                    className={cn(
                      "w-10 aspect-square bg-content2 rounded-lg shadow-custom",
                      "rounded",
                    )}
                    isPressable
                    onPress={() => setExpand(!expand)}
                  >
                    <Image
                      removeWrapper
                      radius="none"
                      alt="Card background"
                      className="z-0 w-full h-full object-cover"
                      src={artwork || cover}
                    />
                  </Card>
                  <div className="flex-1">
                    <div className="font-semibold text-sm line-clamp-1">
                      {title}
                    </div>
                    <div className="text-default-500 text-sm line-clamp-1">
                      {artist}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Buttons.Play variant="light" size="sm" />
                    {paused ? (
                      <Tooltip
                        showArrow
                        closeDelay={0}
                        content={t("articleView.stopPlay")}
                        classNames={{ content: "!shadow-custom" }}
                      >
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="flat"
                          className="animate-in fade-in slide-in-from-left-2"
                          onPress={() => {
                            setTime(0);
                            resetAudio();
                          }}
                        >
                          {<X className="size-4 text-default-500" />}
                        </Button>
                      </Tooltip>
                    ) : (
                      <Buttons.SeekForward
                        variant="light"
                        size="sm"
                        className="animate-in fade-in slide-in-from-left-2"
                      />
                    )}
                    <Tooltip
                      showArrow
                      closeDelay={0}
                      content={isHidden ? "显示播放器" : "隐藏播放器"}
                      classNames={{ content: "!shadow-custom" }}
                    >
                      <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="flat"
                        className="animate-in fade-in slide-in-from-left-2"
                        onPress={() => setIsHidden(!isHidden)}
                      >
                        {<Minimize2 className="size-4 text-default-500" />}
                      </Button>
                    </Tooltip>
                  </div>
                </motion.div>
                {expand && (
                  <motion.div
                    layout
                    transition={transitionConfig}
                    className="flex flex-col items-center gap-2 w-full mt-2"
                  >
                    <Time />
                    <div className="button-group flex items-center w-full justify-between">
                      <SpeedSubmenu />
                      <Buttons.SeekBackward variant="light" size="sm" />
                      <Buttons.Play variant="flat" />
                      <Buttons.SeekForward variant="light" size="sm" />
                      <Buttons.Jump variant="light" size="sm" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </Controls.Group>
          </Controls.Root>
        </MediaPlayer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHidden ? 1 : 0,
          scale: isHidden ? 1 : 0.8,
          display: isHidden ? "block" : "none"
        }}
        transition={transitionConfig}
        className="fixed bottom-4 right-4 z-50"
      >
        <Tooltip
          showArrow
          closeDelay={0}
          content="显示播放器"
          classNames={{ content: "!shadow-custom" }}
        >
          <Button
            isIconOnly
            radius="full"
            size="lg"
            variant="flat"
            className="bg-content1/80 backdrop-blur-lg shadow-custom"
            onPress={() => setIsHidden(false)}
          >
            <Maximize2 className="size-5 text-default-500" />
          </Button>
        </Tooltip>
      </motion.div>
    </>
  );
}
