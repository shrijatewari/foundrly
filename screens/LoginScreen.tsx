import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

// react-native-web renders a crisp focus ring via boxShadow; native uses
// the shadow* props for an equivalent glow.
const focusGlow = (
  Platform.OS === 'web'
    ? { borderColor: colors.accent, boxShadow: '0 0 0 3px rgba(255,59,92,0.1)' }
    : {
        borderColor: colors.accent,
        shadowColor: colors.accent,
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
      }
) as ViewStyle;

type FieldName = 'email' | 'password';

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<FieldName | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Mount animations.
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(20)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  // Interaction animations.
  const buttonScale = useRef(new Animated.Value(1)).current;
  const emailShake = useRef(new Animated.Value(0)).current;
  const passwordShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 500,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoOpacity, cardOpacity, cardTranslateY, footerOpacity]);

  const shake = (anim: Animated.Value) => {
    anim.setValue(0);
    Animated.sequence([
      Animated.timing(anim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 0, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = () => {
    const nextErrors: { email?: string; password?: string } = {};

    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = email.trim()
        ? 'Enter a valid email address'
        : 'Email is required';
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = password
        ? 'Password must be at least 6 characters'
        : 'Password is required';
    }

    setErrors(nextErrors);

    if (nextErrors.email) shake(emailShake);
    if (nextErrors.password) shake(passwordShake);

    if (Object.keys(nextErrors).length === 0) {
      navigation.replace('Main', { screen: 'Dashboard' });
    }
  };

  const handleGoogle = () => {
    navigation.replace('Main', { screen: 'Dashboard' });
  };

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      speed: 50,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      speed: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        {/* Top section */}
        <Animated.View style={[styles.logoBlock, { opacity: logoOpacity }]}>
          <Text style={styles.mark}>F</Text>
          <Text style={styles.wordmark}>Foundrly</Text>
          <Text style={styles.tagline}>Build. Learn. Launch.</Text>
        </Animated.View>

        {/* Form card */}
        <Animated.View
          style={[
            styles.card,
            { opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] },
          ]}
        >
          {/* Email */}
          <Animated.View style={{ transform: [{ translateX: emailShake }] }}>
            <Text style={styles.label}>EMAIL</Text>
            <View style={[styles.inputWrap, focused === 'email' && focusGlow]}>
              <TextInput
                style={styles.input}
                placeholder="founder@startup.com"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                }}
              />
            </View>
            {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
          </Animated.View>

          {/* Password */}
          <Animated.View
            style={[styles.passwordBlock, { transform: [{ translateX: passwordShake }] }]}
          >
            <Text style={styles.label}>PASSWORD</Text>
            <View style={[styles.inputWrap, styles.inputRow, focused === 'password' && focusGlow]}>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                placeholder="••••••••"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                }}
              />
              <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={10} style={styles.eye}>
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>
            {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
          </Animated.View>

          <Pressable style={styles.forgotWrap} hitSlop={6}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>

          {/* Login button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 24 }}>
            <Pressable onPress={handleLogin} onPressIn={onPressIn} onPressOut={onPressOut}>
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.loginButton}
              >
                <Text style={styles.loginLabel}>Login</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Divider */}
          <Text style={styles.divider}>— or —</Text>

          {/* Google */}
          <Pressable
            style={({ pressed }) => [styles.googleButton, pressed && styles.googlePressed]}
            onPress={handleGoogle}
          >
            <View style={styles.googleLogo}>
              <Text style={styles.googleLogoText}>G</Text>
            </View>
            <Text style={styles.googleLabel}>Continue with Google</Text>
          </Pressable>
        </Animated.View>

        {/* Below the card */}
        <Animated.View style={{ opacity: footerOpacity }}>
          <Text style={styles.footer}>
            New to Foundrly? <Text style={styles.footerLink}>Join the waitlist</Text>
          </Text>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  } as ViewStyle,
  logoBlock: {
    alignItems: 'center',
    marginBottom: 48,
  },
  mark: {
    fontFamily: fonts.grotesk.bold,
    fontSize: 28,
    color: colors.accent,
  } as TextStyle,
  wordmark: {
    fontFamily: fonts.grotesk.semibold,
    fontSize: 22,
    color: colors.text,
    marginTop: 8,
  } as TextStyle,
  tagline: {
    fontFamily: fonts.mono.regular,
    fontSize: 13,
    color: colors.textMuted,
    letterSpacing: 2,
    marginTop: 8,
  } as TextStyle,
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 28,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  } as ViewStyle,
  label: {
    fontFamily: fonts.grotesk.medium,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  } as TextStyle,
  inputWrap: {
    height: 48,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  } as ViewStyle,
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  input: {
    fontFamily: fonts.grotesk.regular,
    fontSize: 14,
    color: colors.text,
    height: '100%',
  } as TextStyle,
  inputFlex: {
    flex: 1,
  },
  eye: {
    paddingLeft: 8,
  },
  passwordBlock: {
    marginTop: 18,
  },
  error: {
    fontFamily: fonts.grotesk.regular,
    fontSize: 11,
    color: colors.accent,
    marginTop: 6,
  } as TextStyle,
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgot: {
    fontFamily: fonts.grotesk.regular,
    fontSize: 12,
    color: colors.accent,
  } as TextStyle,
  loginButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginLabel: {
    fontFamily: fonts.grotesk.semibold,
    fontSize: 15,
    color: colors.text,
  } as TextStyle,
  divider: {
    fontFamily: fonts.grotesk.regular,
    fontSize: 13,
    color: colors.placeholder,
    textAlign: 'center',
    marginVertical: 20,
  } as TextStyle,
  googleButton: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  googlePressed: {
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  googleLogo: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  googleLogoText: {
    fontFamily: fonts.grotesk.bold,
    fontSize: 12,
    color: '#4285F4',
  } as TextStyle,
  googleLabel: {
    fontFamily: fonts.grotesk.medium,
    fontSize: 14,
    color: colors.textSubtle,
  } as TextStyle,
  footer: {
    fontFamily: fonts.grotesk.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
  } as TextStyle,
  footerLink: {
    color: colors.accent,
  } as TextStyle,
});
