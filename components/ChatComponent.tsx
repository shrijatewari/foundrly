import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageStyle,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface LoaderConfig {
  enabled: boolean;
  delay?: number;
  duration?: number;
}

export interface Link {
  text: string;
}

export interface Message {
  id: number;
  sender: 'left' | 'right';
  type: 'text' | 'image' | 'text-with-links';
  content: string;
  /** Max bubble width in dp. Defaults to 280. */
  maxWidth?: number;
  loader?: LoaderConfig;
  links?: Link[];
}

export interface Person {
  name: string;
  /** URI string for the avatar image */
  avatar: string;
}

export interface ChatStyle {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  showBorder: boolean;
  nameColor?: string;
}

export interface LinkBubbleStyle {
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  borderColor: string;
}

export interface UiConfig {
  containerWidth?: number;
  containerHeight?: number;
  backgroundColor?: string;
  autoRestart?: boolean;
  restartDelay?: number;
  loader?: { dotColor?: string };
  linkBubbles?: LinkBubbleStyle;
  leftChat?: ChatStyle;
  rightChat?: ChatStyle;
}

export interface ChatConfig {
  leftPerson: Person;
  rightPerson: Person;
  messages: Message[];
}

export interface ChatComponentProps {
  config: ChatConfig;
  uiConfig?: UiConfig;
  style?: ViewStyle;
}

// ============================================================================
// UTILITY
// ============================================================================

const hexToRgba = (hex: string, alpha: number): string => {
  const h = hex.startsWith('#') ? hex : `#${hex}`;
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ============================================================================
// MESSAGE LOADER — three bouncing dots, staggered 150 ms apart
// ============================================================================

const MessageLoader = React.memo<{ dotColor?: string }>(
  ({ dotColor = '#9ca3af' }) => {
    const dots = [
      useRef(new Animated.Value(0)).current,
      useRef(new Animated.Value(0)).current,
      useRef(new Animated.Value(0)).current,
    ];

    useEffect(() => {
      const anims = dots.map((val, i) => {
        const initialDelay = i * 150;
        const restDelay = Math.max(0, 600 - initialDelay);
        return Animated.loop(
          Animated.sequence([
            Animated.delay(initialDelay),
            Animated.timing(val, {
              toValue: -6,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(val, {
              toValue: 0,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.delay(restDelay),
          ])
        );
      });

      anims.forEach(a => a.start());
      return () => anims.forEach(a => a.stop());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <View style={styles.loaderRow}>
        {dots.map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: dotColor, transform: [{ translateY: anim }] },
            ]}
          />
        ))}
      </View>
    );
  }
);
MessageLoader.displayName = 'MessageLoader';

// ============================================================================
// LINK BADGE — visual only, non-interactive (matches web behaviour)
// ============================================================================

const LinkBadge = React.memo<{ link: Link; linkStyle: LinkBubbleStyle }>(
  ({ link, linkStyle }) => (
    <View
      style={[
        styles.linkBadge,
        {
          backgroundColor: linkStyle.backgroundColor,
          borderColor: linkStyle.borderColor,
        },
      ]}
    >
      <Ionicons name="link-outline" size={12} color={linkStyle.iconColor} />
      <Text style={[styles.linkBadgeText, { color: linkStyle.textColor }]}>
        {link.text}
      </Text>
    </View>
  )
);
LinkBadge.displayName = 'LinkBadge';

// ============================================================================
// MESSAGE BUBBLE
// ============================================================================

interface MessageBubbleProps {
  message: Message;
  isLeft: boolean;
  uiConfig: Required<UiConfig>;
  onContentReady?: () => void;
  isLoading: boolean;
  isVisible: boolean;
}

const MessageBubble = React.memo<MessageBubbleProps>(
  ({ message, isLeft, uiConfig, onContentReady, isLoading, isVisible }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const chatStyle = isLeft ? uiConfig.leftChat! : uiConfig.rightChat!;

    // Fade content in when visible, and signal ready for text/links immediately
    useEffect(() => {
      if (!isVisible) return;
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      if (message.type === 'text' || message.type === 'text-with-links') {
        onContentReady?.();
      }
    }, [isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
      onContentReady?.();
    }, [onContentReady]);

    const bubbleStyle = useMemo<ViewStyle>(
      () => ({
        backgroundColor: chatStyle.backgroundColor,
        borderColor: chatStyle.borderColor,
        borderWidth: chatStyle.showBorder ? 0.5 : 0,
        // All corners rounded; flatten the "tail" corner per sender side
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: isLeft ? 0 : 8,
        borderBottomRightRadius: isLeft ? 8 : 0,
        padding: message.type === 'image' ? 4 : 16,
        maxWidth: message.maxWidth ?? 280,
      }),
      [chatStyle, isLeft, message.type, message.maxWidth]
    );

    return (
      <View style={bubbleStyle}>
        {/* Loader — shown while loading, hidden once content is ready */}
        {isLoading && !isVisible && (
          <MessageLoader dotColor={uiConfig.loader?.dotColor} />
        )}

        {/* Content — fades in when isVisible flips true */}
        {isVisible && (
          <Animated.View style={{ opacity: contentOpacity }}>
            {message.type === 'text' && (
              <Text style={[styles.bubbleText, { color: chatStyle.textColor }]}>
                {message.content}
              </Text>
            )}

            {message.type === 'image' && (
              <View style={styles.imageContainer}>
                {!imageLoaded && (
                  <View style={styles.imageLoaderWrap}>
                    <MessageLoader dotColor={uiConfig.loader?.dotColor} />
                  </View>
                )}
                <Image
                  source={{ uri: message.content }}
                  style={[
                    styles.messageImage,
                    !imageLoaded && styles.imageHidden,
                  ] as ImageStyle[]}
                  resizeMode="cover"
                  onLoad={handleImageLoad}
                />
              </View>
            )}

            {message.type === 'text-with-links' && (
              <View>
                <Text
                  style={[
                    styles.bubbleText,
                    styles.linksTextGap,
                    { color: chatStyle.textColor },
                  ]}
                >
                  {message.content}
                </Text>
                <View style={styles.linksRow}>
                  {message.links?.map((link, i) => (
                    <LinkBadge
                      key={i}
                      link={link}
                      linkStyle={uiConfig.linkBubbles!}
                    />
                  ))}
                </View>
              </View>
            )}
          </Animated.View>
        )}
      </View>
    );
  }
);
MessageBubble.displayName = 'MessageBubble';

// ============================================================================
// MESSAGE WRAPPER — sequential loading, avatar, sender name
// ============================================================================

interface MessageWrapperProps {
  message: Message;
  config: ChatConfig;
  uiConfig: Required<UiConfig>;
  previousMessageComplete: boolean;
  onMessageComplete?: (id: number) => void;
  previousMessage: Message | null;
  nextMessage: Message | null;
  onVisibilityChange?: (id: number) => void;
  isNextVisible: boolean;
}

const MessageWrapper = React.memo<MessageWrapperProps>(
  ({
    message,
    config,
    uiConfig,
    previousMessageComplete,
    onMessageComplete,
    previousMessage,
    nextMessage,
    onVisibilityChange,
    isNextVisible,
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [messageCompleted, setMessageCompleted] = useState(false);

    // Wrapper entrance
    const wrapOpacity = useRef(new Animated.Value(0)).current;
    const wrapScale = useRef(new Animated.Value(0.9)).current;
    // Avatar
    const avatarOpacity = useRef(new Animated.Value(0)).current;
    const avatarScale = useRef(new Animated.Value(0)).current;
    // Sender name
    const nameOpacity = useRef(new Animated.Value(0)).current;

    const isLeft = message.sender === 'left';
    const person = isLeft ? config.leftPerson : config.rightPerson;
    const chatStyle = isLeft ? uiConfig.leftChat! : uiConfig.rightChat!;

    const isContinuation = previousMessage?.sender === message.sender;
    const nextSameSender = nextMessage?.sender === message.sender;
    const shouldShowAvatar = !nextSameSender || !isNextVisible;

    // ── Sequential loading chain ───────────────────────────────────────────
    useEffect(() => {
      if (!previousMessageComplete) return;

      const { loader } = message;
      const loaderDelay = 500;
      const totalDelay = loaderDelay + (loader?.duration ?? 1000);

      if (loader?.enabled) {
        const t1 = setTimeout(() => setIsLoading(true), loaderDelay);
        const t2 = setTimeout(() => {
          setIsLoading(false);
          setIsVisible(true);
          onVisibilityChange?.(message.id);
        }, totalDelay);
        return () => { clearTimeout(t1); clearTimeout(t2); };
      } else {
        const t = setTimeout(() => {
          setIsVisible(true);
          onVisibilityChange?.(message.id);
        }, 0);
        return () => clearTimeout(t);
      }
    }, [previousMessageComplete]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Wrapper entrance animation ─────────────────────────────────────────
    useEffect(() => {
      if (!isLoading && !isVisible) return;
      Animated.parallel([
        Animated.timing(wrapOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(wrapScale, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, [isLoading, isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Sender name fade ───────────────────────────────────────────────────
    useEffect(() => {
      if (!isContinuation && (isLoading || isVisible)) {
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 250,
          delay: 150,
          useNativeDriver: true,
        }).start();
      }
    }, [isContinuation, isLoading, isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Avatar animate in/out as group changes ─────────────────────────────
    useEffect(() => {
      if (!isVisible) return;
      Animated.parallel([
        Animated.timing(avatarOpacity, {
          toValue: shouldShowAvatar ? 1 : 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(avatarScale, {
          toValue: shouldShowAvatar ? 1 : 0,
          useNativeDriver: true,
        }),
      ]).start();
    }, [shouldShowAvatar, isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Content ready → complete chain ─────────────────────────────────────
    const handleContentReady = useCallback(() => {
      if (messageCompleted) return;
      setMessageCompleted(true);
      setTimeout(() => onMessageComplete?.(message.id), 350);
    }, [messageCompleted, onMessageComplete, message.id]);

    if (!isLoading && !isVisible) return null;

    const AvatarEl = (
      // Always occupies layout space; opacity/scale hide it visually
      <Animated.Image
        source={{ uri: person.avatar }}
        style={[
          styles.avatar,
          {
            opacity: avatarOpacity,
            transform: [{ scale: avatarScale }],
          },
        ]}
      />
    );

    return (
      <Animated.View
        style={[
          isLeft ? styles.rowLeft : styles.rowRight,
          { opacity: wrapOpacity, transform: [{ scale: wrapScale }] },
        ]}
      >
        {isLeft && AvatarEl}

        <View
          style={[
            styles.messageContent,
            { alignItems: isLeft ? 'flex-start' : 'flex-end' },
          ]}
        >
          {!isContinuation && (
            <Animated.Text
              style={[
                styles.senderName,
                {
                  color: chatStyle.nameColor ?? '#582F0E',
                  opacity: nameOpacity,
                },
              ]}
            >
              {person.name}
            </Animated.Text>
          )}

          <MessageBubble
            message={message}
            isLeft={isLeft}
            uiConfig={uiConfig}
            onContentReady={handleContentReady}
            isLoading={isLoading}
            isVisible={isVisible}
          />
        </View>

        {!isLeft && AvatarEl}
      </Animated.View>
    );
  }
);
MessageWrapper.displayName = 'MessageWrapper';

// ============================================================================
// MAIN CHAT COMPONENT
// ============================================================================

const DEFAULT_UI: Required<UiConfig> = {
  containerWidth: 0,
  containerHeight: 0,
  backgroundColor: '#ffffff',
  autoRestart: false,
  restartDelay: 3000,
  loader: { dotColor: '#9ca3af' },
  linkBubbles: {
    backgroundColor: '#f3f4f6',
    textColor: '#374151',
    iconColor: '#374151',
    borderColor: '#e5e7eb',
  },
  leftChat: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#d1d1d1',
    showBorder: true,
    nameColor: '#000000',
  },
  rightChat: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#d1d1d1',
    showBorder: true,
    nameColor: '#000000',
  },
};

const ChatComponent: React.FC<ChatComponentProps> = ({
  config,
  uiConfig = {},
  style,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [completedMessages, setCompletedMessages] = useState<number[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [key, setKey] = useState(0);

  const ui = useMemo<Required<UiConfig>>(
    () => ({ ...DEFAULT_UI, ...uiConfig } as Required<UiConfig>),
    [uiConfig]
  );

  const handleMessageComplete = useCallback(
    (messageId: number) => {
      setCompletedMessages(prev => {
        const next = [...prev, messageId];
        if (next.length === config.messages.length && ui.autoRestart) {
          setTimeout(() => {
            setCompletedMessages([]);
            setVisibleMessages([]);
            setKey(k => k + 1);
          }, ui.restartDelay);
        }
        return next;
      });
    },
    [config.messages.length, ui.autoRestart, ui.restartDelay]
  );

  const handleVisibilityChange = useCallback((messageId: number) => {
    setVisibleMessages(prev =>
      prev.includes(messageId) ? prev : [...prev, messageId]
    );
  }, []);

  // Top fade gradient — matches web's linear-gradient(to bottom, …)
  const gradientColors = useMemo(
    () =>
      [
        hexToRgba(ui.backgroundColor, 1),
        hexToRgba(ui.backgroundColor, 0.95),
        hexToRgba(ui.backgroundColor, 0.8),
        hexToRgba(ui.backgroundColor, 0.4),
        hexToRgba(ui.backgroundColor, 0),
      ] as const,
    [ui.backgroundColor]
  );

  const containerStyle = useMemo<ViewStyle>(
    () => ({
      ...(ui.containerWidth ? { width: ui.containerWidth } : { width: '100%' }),
      ...(ui.containerHeight ? { height: ui.containerHeight } : { flex: 1 }),
      backgroundColor: ui.backgroundColor,
      borderRadius: 8,
      overflow: 'hidden',
    }),
    [ui.containerWidth, ui.containerHeight, ui.backgroundColor]
  );

  return (
    <View key={key} style={[containerStyle, style]}>
      {/* Top gradient fade overlay — pointer-events none */}
      <View style={styles.gradientWrap} pointerEvents="none">
        <LinearGradient
          colors={gradientColors}
          locations={[0, 0.2, 0.4, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Scrollable messages — auto-scrolls on content size change */}
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {/* Push messages to bottom until they fill the view */}
        <View style={styles.messagesList}>
          {config.messages.map((message, index) => {
            const prev = index > 0 ? config.messages[index - 1] : null;
            const next =
              index < config.messages.length - 1
                ? config.messages[index + 1]
                : null;
            const previousDone =
              index === 0 ||
              completedMessages.includes(config.messages[index - 1].id);
            const isNextVisible = next
              ? visibleMessages.includes(next.id)
              : false;
            const isContinuation = prev?.sender === message.sender;
            const spacing =
              index === 0 ? 0 : isContinuation ? 6 : 32;

            return (
              <View key={message.id} style={{ marginTop: spacing }}>
                <MessageWrapper
                  message={message}
                  config={config}
                  uiConfig={ui}
                  previousMessageComplete={previousDone}
                  onMessageComplete={handleMessageComplete}
                  onVisibilityChange={handleVisibilityChange}
                  previousMessage={prev}
                  nextMessage={next}
                  isNextVisible={isNextVisible}
                />
              </View>
            );
          })}
          {/* Scroll anchor — matches web's h-8 spacer */}
          <View style={styles.scrollAnchor} />
        </View>
      </ScrollView>
    </View>
  );
};

export default ChatComponent;

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // ── Loader ─────────────────────────────────────────────────────────────────
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // ── Link badge ──────────────────────────────────────────────────────────────
  linkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  linkBadgeText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },

  // ── Message bubble ──────────────────────────────────────────────────────────
  bubbleText: {
    fontSize: 14,
    lineHeight: 22,
  },
  linksTextGap: {
    marginBottom: 12,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  imageContainer: {
    minHeight: 128,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoaderWrap: {
    position: 'absolute',
    width: '100%',
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageImage: {
    width: 192,
    height: 128,
    borderRadius: 4,
  },
  imageHidden: {
    opacity: 0,
    width: 0,
    height: 0,
  },

  // ── Message wrapper ─────────────────────────────────────────────────────────
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  rowRight: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    flexShrink: 0,
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },

  // ── Chat container ──────────────────────────────────────────────────────────
  gradientWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 128,
    zIndex: 10,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 32,
  },
  messagesList: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollAnchor: {
    height: 32,
  },
});
