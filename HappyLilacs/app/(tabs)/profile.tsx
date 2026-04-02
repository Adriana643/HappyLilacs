import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ScreenTopBanner } from '@/components/screen-top-banner';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors } from '@/constants/app-colors';
import { supabase } from '@/services/supabase';


export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? '');
      setUsername(
        user.user_metadata?.username ??
        user.user_metadata?.full_name ??
        user.email?.split('@')[0] ?? ''
      );
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPassword) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }
    if (currentPw !== newPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (currentPw.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: currentPw });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password updated!');
      setCurrentPw('');
      setNewPassword('');
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenTopBanner title="Profile" />

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <View style={styles.field}>
          <ThemedText style={styles.label}>Username</ThemedText>
          <ThemedText style={styles.fieldValue}>{username || '—'}</ThemedText>
        </View>

        <View style={styles.field}>
          <ThemedText style={styles.label}>E-mail</ThemedText>
          <ThemedText style={styles.fieldValue}>{email || '—'}</ThemedText>
        </View>

        <View style={styles.field}>
          <ThemedText style={styles.label}>Change Password</ThemedText>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={currentPw}
              onChangeText={setCurrentPw}
              secureTextEntry={!showPw}
              autoCapitalize="none"
              placeholder="New password"
              placeholderTextColor="#aaa"
            />
            <Pressable
              onPress={() => setShowPw(v => !v)}
              hitSlop={8}
              style={styles.eyeBtn}
            >
              <IconSymbol
                name={showPw ? 'eye' : 'eye.slash'}
                size={20}
                color="#888"
              />
            </Pressable>
          </View>
        </View>


        <View style={styles.field}>
          <ThemedText style={styles.label}>New Password</ThemedText>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleChangePassword}
          />
        </View>
        <Pressable
          style={[styles.primaryBtn]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.primaryBtnText}>
            {loading ? 'Updating…' : 'Change Password'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.deleteBtn]}
          // onPress={}
          disabled={loading}
        >
          <Text style={styles.deleteBtnText}>Delete Account</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  body: {
    padding: 20,
    paddingTop: 12,
  },
  logoutBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#7D6A9B',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 8,
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 3,
    color: '#493A75'
  },
  fieldValue: {
    color: AppColors.muted,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    backgroundColor: '#F5F5F5',
    color: '#222',
    fontSize: 15,
  },
  eyeBtn: {
    marginLeft: 10,
  },
  primaryBtn: {
    backgroundColor: '#7D6A9B',
    paddingVertical: 13,
    borderRadius: 22,
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 48,
    marginTop: 8,
    marginBottom: 10,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  deleteBtn: {
    backgroundColor: '#B74343',
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 28,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  }
});