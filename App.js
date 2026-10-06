import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Bell, Home, Calendar, List, Users, User, Star, Heart, MessageSquare, Flame, ChevronLeft, Send, Mic, LogOut, Settings, Shield, Moon, Globe } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// 1. ANIME DATA LIST
const INITIAL_ANIME_DATA = [
  { id: '1', title: 'Solo Leveling', season_info: 'Season 2', badge_type: 'NEW SEASON', jap_title: '俺だけレベルアップな件', formatted_date: 'Jan 17, 2026', likes: 4800, comments: 2100, rating: 4.8, flames: 950, hoursAhead: 2, image_url: 'https://unsplash.com', description: 'Song Jin-Woo returns stronger than ever as the absolute Monarch. The battle for the safety of the real world begins again with higher stakes and cosmic level threats.' },
  { id: '2', title: 'Demon Slayer', season_info: 'Hashira Training Arc', badge_type: 'SEASON 4', jap_title: '鬼滅の刃', formatted_date: 'Apr 12, 2026', likes: 3600, comments: 1800, rating: 4.7, flames: 820, hoursAhead: 74, image_url: 'https://unsplash.com', description: 'The Hashira gather for intense strategic training operations. The final battle against Muzan Kibutsuji draws closer as secrets of the marks unfold.' },
  { id: '3', title: 'Jujutsu Kaisen', season_info: 'Season 3', badge_type: 'NEW ANIME', jap_title: '呪術廻戦', formatted_date: 'Jul 6, 2026', likes: 2900, comments: 1400, rating: 4.6, flames: 710, hoursAhead: 140, image_url: 'https://unsplash.com', description: 'The Culling Game begins. Yuji Itadori and his companions enter structural barriers to participate in ancient sorcerer elimination deathmatches.' },
  { id: '4', title: 'One Piece', season_info: 'Egghead Island Arc', badge_type: 'POPULAR', jap_title: 'ワンピース', formatted_date: 'Every Sunday', likes: 9200, comments: 5100, rating: 4.9, flames: 1200, hoursAhead: 210, image_url: 'https://unsplash.com', description: 'The Straw Hat Pirates arrive at the futuristic island of Dr. Vegapunk, discovering historical secrets that world governments have hidden for eras.' }
];

// 2. LANGUAGE TRANSLATION DICTIONARY
const TRANSLATIONS = {
  EN: { all: 'All', newReleases: 'New Releases', season2: 'Season 2', upcoming: 'Upcoming', popular: 'Popular', track: 'TRACK • COUNTDOWN • NEVER MISS', details: 'ANIME DETAILS', overview: 'Story Summary & Overview', chatPlaceholder: 'Type a supportive message...', noSaved: 'No Bookmarked Shows Yet', globalFaves: 'Global Favourites List', profileConfig: 'User Profile & Configurations', changeLanguage: 'Select Application Language' },
  HI: { all: 'सब कुछ', newReleases: 'नया रिलीज', season2: 'सीजन २', upcoming: 'आगामी', popular: 'लोकप्रिय', track: 'ट्रैक • काउंटडाउन • कभी न चूकें', details: 'एनीमे विवरण', overview: 'कहानी का सारांश और समीक्षा', chatPlaceholder: 'एक संदेश टाइप करें...', noSaved: 'कोई बुकमार्क शो नहीं मिला', globalFaves: 'ग्लोबल पसंदीदा सूची', profileConfig: 'उपयोगकर्ता प्रोफ़ाइल और सेटिंग्स', changeLanguage: 'एप्लिकेशन भाषा चुनें' }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [animeStateData, setAnimeStateData] = useState(INITIAL_ANIME_DATA);
  const [savedIds, setSavedIds] = useState(['2']);
  const [chatMessages, setChatMessages] = useState([
    { id: '1', user: 'OtakuGamer', text: 'Solo Leveling Season 2 animation looks insane!', time: '20:10' },
    { id: '2', user: 'MangaReader', text: 'Can wait for the Culling Game arc to drop!', time: '20:11' }
  ]);
  const [currentInputText, setCurrentInputText] = useState('');
  const [userProfile, setUserProfile] = useState({ name: 'Harsh Vardhan', email: 'harsh.otaku@gmail.com' });

  const lang = TRANSLATIONS[currentLanguage];

  const handleEngagementPress = (id, type) => {
    setAnimeStateData(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [type]: item[type] + 1 };
      }
      return item;
    }));
    if (selectedAnime && selectedAnime.id === id) {
      setSelectedAnime(prev => ({ ...prev, [type]: prev[type] + 1 }));
    }
  };

  const toggleBookmark = (id) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSendMessage = () => {
    if (currentInputText.trim() === '') return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    setChatMessages(prev => [...prev, { id: Date.now().toString(), user: 'You', text: currentInputText, time: timeStr }]);
    setCurrentInputText('');
  };

  const CountdownBox = ({ targetDate }) => {
    const [timerString, setTimerString] = useState('00h : 00m : 00s');
    useEffect(() => {
      const runCalc = () => {
        const diff = new Date(targetDate) - new Date();
        if (diff <= 0) { setTimerString('AIRING NOW'); return; }
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24) + (d * 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimerString(`${h.toString().padStart(2,'0')}h : ${m.toString().padStart(2,'0')}m : ${s.toString().padStart(2,'0')}s`);
      };
      runCalc();
      const interval = setInterval(runCalc, 1000);
      return () => clearInterval(interval);
    }, [targetDate]);

    return (
      <View style={styles.neonGlowCountdown}>
        <Text style={styles.countdownTimerText}>{timerString}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.masterContainer}>
      <StatusBar style="light" />

      {selectedAnime ? (
        <View style={styles.fullDetailOverlay}>
          <View style={styles.detailsHeader}>
            <TouchableOpacity onPress={() => setSelectedAnime(null)} style={styles.backButtonFrame}>
              <ChevronLeft size={24} color="#FFF" />
              <Text style={styles.detailsHeaderTitle}>{lang.details}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleBookmark(selectedAnime.id)}>
              <Heart size={24} color={savedIds.includes(selectedAnime.id) ? "#EF4444" : "#FFF"} fill={savedIds.includes(selectedAnime.id) ? "#EF4444" : "transparent"} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.detailsScrollFrame}>
            <Image source={{ uri: selectedAnime.image_url }} style={styles.detailHeroImage} resizeMode="cover" />
            <View style={styles.detailContentBlock}>
              <Text style={styles.detailAnimeTitle}>{selectedAnime.title}</Text>
              <Text style={styles.detailAnimeJap}>{selectedAnime.jap_title} • {selectedAnime.season_info}</Text>
              
              <View style={styles.detailEngagementGrid}>
                <TouchableOpacity onPress={() => handleEngagementPress(selectedAnime.id, 'flames')} style={styles.engagementPillButton}>
                  <Flame size={16} color="#F97316" /><Text style={styles.engagementCounterText}>{selectedAnime.flames}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEngagementPress(selectedAnime.id, 'likes')} style={styles.engagementPillButton}>
                  <Heart size={16} color="#EF4444" /><Text style={styles.engagementCounterText}>{selectedAnime.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.engagementPillButton}>
                  <Star size={16} color="#EAB308" /><Text style={styles.engagementCounterText}>{selectedAnime.rating}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dividerLine} />
              <Text style={styles.sectionHeaderLabel}>{lang.overview}</Text>
              <Text style={styles.synopsisBodyText}>{selectedAnime.description}</Text>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {currentScreen === 'Home' && (
            <View style={styles.masterHeaderBar}>
              <View style={styles.headerLeftBrandGroup}>
                <View style={styles.brandingLogoCircle}><Text style={styles.brandingLogoText}>A</Text></View>
                <View>
                  <Text style={styles.brandTitleTextText}>Anime Tracker</Text>
                  <Text style={styles.brandSubtitleTagline}>{lang.track}</Text>
                </View>
              </View>
              <View style={styles.headerRightActionGroup}>
                <TouchableOpacity style={styles.actionIconTouchArea}><Search size={22} color="#FFF" /></TouchableOpacity>
                <TouchableOpacity style={styles.actionIconTouchArea}><Bell size={22} color="#FFF" /></TouchableOpacity>
              </View>
            </View>
          )}

          {currentScreen === 'SaveList' && (
            <View style={styles.staticSubHeader}><Text style={styles.staticSubHeaderTitle}>{lang.globalFaves}</Text></View>
          )}

          {currentScreen === 'Profile' && (
            <View style={styles.staticSubHeader}><Text style={styles.staticSubHeaderTitle}>{lang.profileConfig}</Text></View>
          )}

          {currentScreen === 'Home' && (
            <View style={{ flex: 1 }}>
   chatInputSystemBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#0A0F24', borderTopWidth: 1, borderColor: '#1E293B', marginBottom: 76 },
chatInputFieldText: { flex: 1, height: 40, backgroundColor: '#050918', borderRadius: 20, paddingHorizontal: 16, color: '#FFF', fontSize: 13, borderWidth: 1, borderColor: '#1E293B' },
chatMicrophoneTouchWrapper: { padding: 8, marginLeft: 4 },
chatSendActionIconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
profileControlDashboardView: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
profileAvatarClusterCard: { alignItems: 'center', backgroundColor: '#0A0F24', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#1E293B', marginBottom: 20 },
profileBigAvatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#D946EF', justifyContent: 'center', alignItems: 'center' },
profileAvatarTextLetter: { color: '#FFF', fontSize: 28, fontWeight: '900' },
profileCardUserName: { color: '#FFF', fontSize: 18, fontWeight: '800', marginTop: 12 },
profileCardUserEmail: { color: '#6B7280', fontSize: 12, fontWeight: '600', marginTop: 2 },
settingsGroupHeaderLabel: { color: '#6B7280', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' },
languageToggleContainerRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
langPillButton: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: '#050918', alignItems: 'center', borderWidth: 1, borderColor: '#1E293B' },
langPillButtonActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
langPillLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: '700' },
langPillLabelActive: { color: '#FFF' },
profileLogoutActionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)', marginTop: 10 },
logoutActionLabelText: { color: '#EF4444', fontSize: 13, fontWeight: '700' }
});
---
### 📂 File 3: `tailwind.config.js` (Ekdam Aakhiri Choti File)
Pichle message ke aakhiri me jo ek aur chota code tha jisme `module.exports` likha tha, woh tumhaari **Teesri File** hai jiska naam hai `tailwind.config.js`. 

Usko as it is alag se us naam ki file bana kar daal dena.

---

Ab clear hua na dost? **Total sirf 3 files banani hain:**
1. `package.json` (Pichle message ka pehla chota code)
2. `App.js` (Is message ka yeh upar wala pura bada code ek sath)
3. `tailwind.config.js` (Pichle message ka aakhiri chota code)

<FollowUp>
Bhai, mujhe batao kya ab tumhein confusion door hua? Agar tumne GitHub par **yeh dono files bana kar save** kar li hain, toh mujhe batao, phir main tumhe **Expo cloud se isey directly build** karne ka agla step batata hoon!
</FollowUp>
ab bataiye code to aapane likh kar diye De Diya Hai To hamen abhi cloud hai ki jarurat nahin Hai ab Kahan Se Kahan connect karna hai yah bataiye
