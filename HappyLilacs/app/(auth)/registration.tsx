import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Defs, ClipPath, Ellipse, Rect, Image as SvgImage } from 'react-native-svg';
import { signUpWithEmail } from '@/services/auth';

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

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      Alert.alert('Account created');
      router.back();
    } catch (err: any) {
      Alert.alert('Sign up failed', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <BackgroundDecoration />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create{'\n'}Account</Text>
        </View>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

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

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 210 },
  titleRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 32, gap: 16,
  },
  backButton: {
    backgroundColor: '#ede8f5', borderRadius: 20,
    width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 18, color: '#3b2d6e' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#3b2d6e' },
  label: { fontSize: 14, color: '#3b2d6e', fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#ede8f5', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16, fontSize: 14,
  },
  button: {
    backgroundColor: '#6b4fa0', borderRadius: 25,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});