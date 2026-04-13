import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScreenTopBanner } from "@/components/screen-top-banner";

export default function PlantInfo() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [plant, setPlant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { fetchPlant(); }, [id]);

async function fetchPlant() {
  setLoading(true);
  console.log('API KEY:', process.env.EXPO_PUBLIC_PERENUAL_API_KEY);
  try {
    const res = await fetch(
      `https://perenual.com/api/species/details/${id}?key=${process.env.EXPO_PUBLIC_PERENUAL_API_KEY}`
    );
    const data = await res.json();
    console.log('API RESPONSE:', JSON.stringify(data).slice(0, 300)); // add this
   
      if (!res.ok || data?.error || data?.message) {
      console.log("API FAILED:", data);
      setPlant(null);
      return;
    }
    setPlant(data);

      const scientificName = data.scientific_name?.[0];
      const namesToTry = [scientificName, data.common_name].filter(Boolean);

      for (const searchTerm of namesToTry) {
        try {
          const summaryRes = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`
          );
          const summaryData = await summaryRes.json();

          const extract = summaryData.extract ?? "";
          const title = summaryData.title?.toLowerCase() ?? "";
          const isPlantRelated =
            extract.toLowerCase().includes("plant") ||
            extract.toLowerCase().includes("species") ||
            extract.toLowerCase().includes("tree") ||
            extract.toLowerCase().includes("shrub") ||
            extract.toLowerCase().includes("flower") ||
            extract.toLowerCase().includes("genus") ||
            (scientificName && title.includes(scientificName.split(" ")[0].toLowerCase()));

          if (extract && isPlantRelated) {
            setPlant((prev: any) => ({ ...prev, description: extract }));
            break;
          }
        } catch (e) {
          console.log("Wiki error:", e);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6B4FA0" />
    </View>
  );

  const description = plant?.description || "No description available.";
  const shortDesc = description.slice(0, 150);

  const waterMap: Record<string, string> = {
    Frequent: "500ml", Average: "333ml", Minimum: "150ml", None: "0ml",
  };
  const waterAmount = waterMap[plant?.watering] ?? "333ml";
  const sunlight = plant?.sunlight?.[0] ?? "Full sun";
  const sunlightLabel = sunlight.toLowerCase().includes("full") ? "Full sun"
    : sunlight.toLowerCase().includes("part") ? "Partial" : "Normal";

  return (
    <View style={styles.screen}>
      <ScreenTopBanner
        title="Plant Information"
        onBack={() => router.push("/(tabs)/my-plants")}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: plant?.default_image?.regular_url }}
          style={styles.image}
        />

        <View style={styles.card}>
          <Text style={styles.title}>
            {plant?.common_name
              ? plant.common_name.charAt(0).toUpperCase() + plant.common_name.slice(1)
              : plant?.scientific_name?.[0]}
          </Text>

          <View style={styles.tags}>
            {plant?.indoor !== false && (
              <View style={styles.tag}><Text style={styles.tagText}>Indoor</Text></View>
            )}
            {plant?.pet_friendly && (
              <View style={styles.tag}><Text style={styles.tagText}>Pet friendly</Text></View>
            )}
            {plant?.family && (
              <View style={styles.tag}><Text style={styles.tagText}>{plant.family}</Text></View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.wikiSource}>From Wikipedia, the free encyclopedia</Text>
          <Text style={styles.description}>
            {expanded || description.length <= 150 ? description : shortDesc}
            {!expanded && description.length > 150 && (
              <Text onPress={() => setExpanded(true)}>
                {"... "}
                <Text style={styles.readMore}>Read more</Text>
              </Text>
            )}
          </Text>

          {description !== "No description available." && (
            <TouchableOpacity
              onPress={() => {
                const searchTerm = plant?.scientific_name?.[0] || plant?.common_name;
                Linking.openURL(`https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm)}`);
              }}
              style={styles.wikiLink}
            >
             <Ionicons name="book-outline" size={16} color="#6B4FA0" />
              <Text style={styles.wikiLinkText}>Read full article on Wikipedia</Text>
              <Ionicons name="open-outline" size={14} color="#6B4FA0" />
            </TouchableOpacity>
          )}

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#E8F5E9" }]}>
                <Ionicons name="resize-outline" size={18} color="#4CAF50" />
              </View>
              <Text style={[styles.statLabel, { color: "#4CAF50" }]}>Height</Text>
              <Text style={styles.statValue}>Small</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#E3F2FD" }]}>
                <Ionicons name="water-outline" size={18} color="#2196F3" />
              </View>
              <Text style={[styles.statLabel, { color: "#2196F3" }]}>Water</Text>
              <Text style={styles.statValue}>{waterAmount}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#FFF9C4" }]}>
                <Ionicons name="sunny-outline" size={18} color="#FBC02D" />
              </View>
              <Text style={[styles.statLabel, { color: "#FBC02D" }]}>Light</Text>
              <Text style={styles.statValue}>{sunlightLabel}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#FCE4EC" }]}>
                <Ionicons name="thermometer-outline" size={18} color="#E91E63" />
              </View>
              <Text style={[styles.statLabel, { color: "#E91E63" }]}>Humidity</Text>
              <Text style={styles.statValue}>
                {plant?.watering === "Frequent" ? "High" : plant?.watering === "Minimum" ? "Low" : "56%"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7F7" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F7F7F7" },
  scroll: { flex: 1 },
  image: { width: "100%", height: 280, resizeMode: "cover" },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    padding: 20,
    paddingTop: 24,
    minHeight: 600,
  },
  title: { 
    fontSize: 26, 
    fontWeight: "800", 
    color: "#1A1A1A", 
    marginBottom: 12 
  },
  tags: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 8, 
    marginBottom: 20 
  },
  tag: {
    backgroundColor: "#EFEFEF", 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  tagText: { 
    fontSize: 13, 
    color: "#555" },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#1A1A1A", 
    marginBottom: 2 
  },
  wikiSource: { 
    fontSize: 12, 
    color: "#999", 
    marginBottom: 8 
  },
  description: { 
    fontSize: 14, 
    color: "#444", 
    lineHeight: 21, 
    marginBottom: 12 
  },
  readMore: { 
    fontWeight: "700", 
    color: "#1A1A1A" 
  },
  wikiLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
    padding: 10,
    backgroundColor: "#F3EFF9",
    borderRadius: 10,
  },
  wikiLinkText: {
    flex: 1,
    fontSize: 13,
    color: "#6B4FA0",
    fontWeight: "600",
  },
  statsGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 12 
  },
  statCard: {
    width: "47%", 
    borderRadius: 16, 
    padding: 16,
    backgroundColor: "#F7F7F7",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  statIcon: {
    width: 36, 
    height: 36, 
    borderRadius: 10,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  statLabel: { 
    fontSize: 13, 
    fontWeight: "600", 
    marginBottom: 4 
  },
  statValue: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#1A1A1A" 
  },
});
