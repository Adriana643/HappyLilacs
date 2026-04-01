import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

export default function RootLayout() {
    const { session, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = (segments[0] as string) === '(auth)';

        if (!session && !inAuthGroup) {
            router.replace('/(auth)/login' as any);
        } else if (session && inAuthGroup) {
            router.replace('/(tabs)' as any);
        }
  }, [session, loading]);

  return <Slot />;
}