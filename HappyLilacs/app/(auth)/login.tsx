import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Defs, ClipPath, Ellipse, Rect, Image as SvgImage } from 'react-native-svg';
import { signInWithEmail } from '@/services/auth';

const { width: SW, height: SH } = Dimensions.get('window');

function BackgroundDecoration() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Svg width={SW} height={SH} viewBox="0 0 393 852">
        <Defs>
          <ClipPath id="pillClip">
            <Rect x="15" y="-116" width="109" height="317" rx="54.5" />
          </ClipPath>
        </Defs>

        {/* Left pill with image */}
        <SvgImage
          x="15"
          y="-116"
          width="109"
          height="317"
          href={require('@/assets/images/lilacs-wallpaper.jpg')}
          clipPath="url(#pillClip)"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Top-right circle */}
        <Ellipse cx="361" cy="12.5" rx="77" ry="70.5" fill="#B39AC2" />
        {/* Top-right darker circle */}
        <Ellipse cx="246.5" cy="-26" rx="114.5" ry="86" fill="#493A75" fillOpacity="0.5" />
        {/* Bottom-left circle */}
        <Ellipse cx="13" cy="827.5" rx="125" ry="120.5" fill="#B39AC2" />
        {/* Bottom-center circle */}
        <Ellipse cx="178.5" cy="880.5" rx="128.5" ry="86.5" fill="#9076A5" fillOpacity="0.77" />
      </Svg>
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      Alert.alert('Login failed', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <BackgroundDecoration />

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to{'\n'}HappyLilacs</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/registration' as any)}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log in'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 210 },
  title: {
    fontSize: 26, fontWeight: 'bold', color: '#3b2d6e',
    textAlign: 'center', marginBottom: 32,
  },
  label: { fontSize: 14, color: '#3b2d6e', fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#ede8f5', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16, fontSize: 14,
  },
  signupRow: { flexDirection: 'row', marginBottom: 24 },
  signupText: { fontSize: 13, color: '#3b2d6e', fontWeight: '600' },
  signupLink: { fontSize: 13, color: '#7c5cbf', fontWeight: '700' },
  button: {
    backgroundColor: '#6b4fa0', borderRadius: 25,
    paddingVertical: 14, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});