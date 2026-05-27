// Central LocalStorage Management for ElectionGuide India

const storage = {
  getProfile: () => {
    const raw = localStorage.getItem('voterProfile');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Profile parse failed, resetting.");
      return null;
    }
  },

  saveProfile: (profile) => {
    localStorage.setItem('voterProfile', JSON.stringify(profile));
  },

  clearProfile: () => {
    localStorage.removeItem('voterProfile');
  },

  getCompletedPhases: () => {
    const raw = localStorage.getItem('completedPhases');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  saveCompletedPhases: (phases) => {
    localStorage.setItem('completedPhases', JSON.stringify(phases));
  },

  getReminders: () => {
    const raw = localStorage.getItem('voterReminders');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  saveReminders: (reminders) => {
    localStorage.setItem('voterReminders', JSON.stringify(reminders));
  },

  getLanguage: () => {
    return localStorage.getItem('voterLang') || 'en';
  },

  saveLanguage: (lang) => {
    localStorage.setItem('voterLang', lang);
  }
};
